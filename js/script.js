/* ==========================================================================
   Rudzani Community Outreach - script.js (Part 3)

   Contents
   1.  Settings and small helper functions
   2.  Scroll reveal animation, back-to-top button and animated counters
   3.  Quick view modal (index.html)
   4.  Tabs and accordion with jQuery (about.html, enquiry.html)
   5.  Gallery with lightbox (about.html)
   6.  Dynamic programme list: search, filter, sort, load more (programmes.html)
   7.  Form validation engine (enquiry.html and contact.html)
   8.  Enquiry form: processing, response and AJAX submission (enquiry.html)
   9.  Contact form: compile an email (contact.html)
   10. Interactive map with Leaflet (contact.html)
   11. Start-up
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. SETTINGS AND HELPER FUNCTIONS
   ========================================================================== */

/* The email address that receives the messages from the contact form.
   It comes from js/data.js, so it only has to be changed in one place. */
const RECIPIENT_EMAIL = (typeof organisation !== "undefined") ? organisation.email : "info@rudzanioutreach.org.za";

/* Number of programme cards shown at one time before "Load more" is pressed */
const PAGE_SIZE = 6;

/* Users who prefer less motion do not get animations */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Shortcut for document.getElementById */
function byId(id) {
    return document.getElementById(id);
}

/* Creates an element, adds a class and text. textContent is used (not innerHTML)
   so text typed by a visitor can never run as HTML (protects against XSS attacks). */
function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

/* Formats a number as South African Rand, e.g. R 26 400 */
function formatRand(amount) {
    return "R " + amount.toLocaleString("en-ZA");
}

/* Returns today's date as YYYY-MM-DD using the visitor's local time */
function toDateString(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

/* Keeps focus inside a dialog while it is open (keyboard accessibility) */
function trapFocus(event, container) {
    if (event.key !== "Tab") {
        return;
    }
    const focusable = container.querySelectorAll("a[href], button:not([disabled])");
    if (focusable.length === 0) {
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}


/* ==========================================================================
   2. SCROLL REVEAL, BACK-TO-TOP BUTTON AND ANIMATED COUNTERS
   ========================================================================== */

/* Elements marked with data-reveal fade in when they scroll into view.
   Elements that are already on the screen are left alone so nothing flickers. */
function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (items.length === 0 || prefersReducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }
            const element = entry.target;
            element.classList.add("is-visible");
            obs.unobserve(element);

            /* When the fade is finished the helper classes are removed, so the
               normal card hover effect works again. */
            element.addEventListener("transitionend", function done(event) {
                if (event.propertyName !== "opacity") {
                    return;
                }
                element.classList.remove("reveal", "is-visible");
                element.style.transitionDelay = "";
                element.removeEventListener("transitionend", done);
            });
        });
    }, { threshold: 0.12 });

    items.forEach(function (element) {
        if (element.getBoundingClientRect().top > window.innerHeight) {
            const position = Array.prototype.indexOf.call(element.parentElement.children, element);
            element.style.transitionDelay = ((position % 3) * 0.1) + "s";   /* small delay between neighbours */
            element.classList.add("reveal");
            observer.observe(element);
        }
    });
}

/* Creates a round "back to top" button and shows it after the visitor scrolls down */
function initBackToTop() {
    const button = makeElement("button", "back-to-top", "\u2191");
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    document.body.appendChild(button);

    let waiting = false;
    window.addEventListener("scroll", function () {
        if (waiting) {
            return;
        }
        waiting = true;
        window.requestAnimationFrame(function () {
            button.classList.toggle("is-shown", window.scrollY > 400);
            waiting = false;
        });
    }, { passive: true });

    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
}

/* Counts the impact numbers up from 0 when they scroll into view.
   data-count = target number, data-suffix = text after the number (e.g. +),
   data-since = a year; the number of years since that year is calculated. */
function initCounters() {
    const counters = document.querySelectorAll(".stat-number");
    if (counters.length === 0) {
        return;
    }

    function getTarget(counter) {
        if (counter.dataset.since) {
            return new Date().getFullYear() - Number(counter.dataset.since);
        }
        return Number(counter.dataset.count);
    }

    function show(counter, value) {
        counter.textContent = value + (counter.dataset.suffix || "");
    }

    function animate(counter) {
        const target = getTarget(counter);
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);   /* ease-out: fast at first, slow at the end */
            show(counter, Math.round(target * eased));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        counters.forEach(function (counter) { show(counter, getTarget(counter)); });
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animate(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
        show(counter, 0);
        observer.observe(counter);
    });
}


/* ==========================================================================
   3. QUICK VIEW MODAL (index.html)
   ========================================================================== */

function initModal() {
    const modal = byId("quickViewModal");
    if (!modal || typeof quickViewData === "undefined") {
        return;
    }

    const image = byId("modalImage");
    const title = byId("modalTitle");
    const text = byId("modalText");
    const link = byId("modalLink");
    const closeButton = modal.querySelector(".modal-close");
    let lastFocused = null;

    function openModal(key, trigger) {
        const details = quickViewData[key];
        if (!details) {
            return;
        }
        lastFocused = trigger;
        image.src = details.image;
        image.alt = details.alt;
        title.textContent = details.title;
        text.textContent = details.text;
        link.href = details.link;
        link.textContent = details.linkText;
        modal.hidden = false;
        document.body.style.overflow = "hidden";   /* stops the page behind from scrolling */
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused) {
            lastFocused.focus();
        }
    }

    /* Event delegation: one listener on the document handles every "Quick view" button */
    document.addEventListener("click", function (event) {
        const trigger = event.target.closest("[data-modal]");
        if (trigger) {
            openModal(trigger.dataset.modal, trigger);
        }
    });

    modal.addEventListener("click", function (event) {
        /* Clicking the dark background or the X closes the modal */
        if (event.target === modal || event.target.closest(".modal-close")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (modal.hidden) {
            return;
        }
        if (event.key === "Escape") {
            closeModal();
        }
        trapFocus(event, modal);
    });
}


/* ==========================================================================
   4. TABS AND ACCORDION WITH jQUERY
   ========================================================================== */

/* Tabs on about.html ("Who We Support") */
function initTabs($) {
    const $tabs = $("#audienceTabs");
    if ($tabs.length === 0) {
        return;
    }

    const $buttons = $tabs.find(".tab-button");
    const $panels = $tabs.find(".tab-panel");

    function activate($button, animate) {
        $buttons.attr({ "aria-selected": "false", tabindex: "-1" });
        $button.attr({ "aria-selected": "true", tabindex: "0" });

        $panels.prop("hidden", true);
        const $panel = $("#" + $button.attr("aria-controls"));
        $panel.prop("hidden", false);
        if (animate) {
            $panel.hide().fadeIn(300);   /* jQuery fade effect */
        }
    }

    $buttons.on("click", function () {
        activate($(this), true);
    });

    /* Arrow keys, Home and End move between the tabs (keyboard accessibility) */
    $buttons.on("keydown", function (event) {
        const index = $buttons.index(this);
        let next = null;
        if (event.key === "ArrowRight") { next = (index + 1) % $buttons.length; }
        if (event.key === "ArrowLeft")  { next = (index - 1 + $buttons.length) % $buttons.length; }
        if (event.key === "Home")       { next = 0; }
        if (event.key === "End")        { next = $buttons.length - 1; }
        if (next !== null) {
            event.preventDefault();
            const $target = $buttons.eq(next);
            activate($target, true);
            $target.trigger("focus");
        }
    });

    activate($buttons.first(), false);   /* the first tab is open when the page loads */
}

/* Accordion on enquiry.html (FAQ). Only one answer is open at a time. */
function initAccordion($) {
    const $accordion = $("#faqAccordion");
    if ($accordion.length === 0) {
        return;
    }

    $accordion.find(".accordion-panel").hide();

    $accordion.on("click", ".accordion-trigger", function () {
        const $trigger = $(this);
        const $panel = $("#" + $trigger.attr("aria-controls"));
        const isOpen = $trigger.attr("aria-expanded") === "true";

        /* Close any other open question */
        $accordion.find(".accordion-trigger[aria-expanded='true']").not($trigger).each(function () {
            $(this).attr("aria-expanded", "false");
            $("#" + $(this).attr("aria-controls")).stop(true, true).slideUp(250);
        });

        $trigger.attr("aria-expanded", String(!isOpen));
        if (isOpen) {
            $panel.stop(true, true).slideUp(250);
        } else {
            $panel.stop(true, true).slideDown(250);
        }
    });
}


/* ==========================================================================
   5. GALLERY WITH LIGHTBOX (about.html)
   ========================================================================== */

function initLightbox() {
    const gallery = byId("gallery");
    const box = byId("lightbox");
    if (!gallery || !box) {
        return;
    }

    const links = Array.prototype.slice.call(gallery.querySelectorAll("a"));
    const image = byId("lightboxImage");
    const caption = byId("lightboxCaption");
    const closeButton = box.querySelector(".lightbox-close");
    let current = 0;
    let lastFocused = null;

    /* Shows photo number i (wraps around at the start and the end) */
    function showPhoto(i) {
        current = (i + links.length) % links.length;
        const link = links[current];
        image.src = link.href;
        image.alt = link.querySelector("img").alt;
        caption.textContent = link.dataset.caption || "";

        /* Restart the pop-in animation for every new photo */
        image.style.animation = "none";
        void image.offsetWidth;
        image.style.animation = "";
    }

    function openLightbox(i, trigger) {
        lastFocused = trigger;
        showPhoto(i);
        box.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        box.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused) {
            lastFocused.focus();
        }
    }

    /* Event delegation: one listener for all thumbnails */
    gallery.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (!link) {
            return;
        }
        event.preventDefault();   /* stops the browser from opening the image file */
        openLightbox(links.indexOf(link), link);
    });

    box.addEventListener("click", function (event) {
        if (event.target === box || event.target.closest(".lightbox-close")) {
            closeLightbox();
        } else if (event.target.closest(".lightbox-prev")) {
            showPhoto(current - 1);
        } else if (event.target.closest(".lightbox-next")) {
            showPhoto(current + 1);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (box.hidden) {
            return;
        }
        if (event.key === "Escape")     { closeLightbox(); }
        if (event.key === "ArrowLeft")  { showPhoto(current - 1); }
        if (event.key === "ArrowRight") { showPhoto(current + 1); }
        trapFocus(event, box);
    });

    /* Swipe left or right on a phone to change photo */
    let touchStartX = 0;
    box.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    box.addEventListener("touchend", function (event) {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 50) {
            showPhoto(distance < 0 ? current + 1 : current - 1);
        }
    }, { passive: true });
}


/* ==========================================================================
   6. DYNAMIC PROGRAMME LIST: SEARCH, FILTER, SORT (programmes.html)
   The cards are created with JavaScript from programmeData (js/data.js).
   ========================================================================== */

function initProgrammes() {
    const list = byId("programmeList");
    if (!list || typeof programmeData === "undefined") {
        return;
    }

    const searchInput = byId("searchInput");
    const categorySelect = byId("categoryFilter");
    const sortSelect = byId("sortSelect");
    const resetButton = byId("resetFilters");
    const filterForm = byId("filterForm");
    const resultsCount = byId("resultsCount");
    const noResults = byId("noResults");
    const loadMoreButton = byId("loadMoreBtn");

    const state = { search: "", category: "all", sort: "name-asc", visible: PAGE_SIZE };

    /* Fill the "Programme" drop-down with each category found in the data */
    const categories = [];
    programmeData.forEach(function (programme) {
        if (categories.indexOf(programme.category) === -1) {
            categories.push(programme.category);
        }
    });
    categories.forEach(function (category) {
        const option = makeElement("option", "", category);
        option.value = category;
        categorySelect.appendChild(option);
    });

    /* Returns the programmes that match the search word and the category, in the chosen order */
    function getResults() {
        const words = state.search.trim().toLowerCase().split(/\s+/).filter(Boolean);

        const matches = programmeData.filter(function (programme) {
            if (state.category !== "all" && programme.category !== state.category) {
                return false;
            }
            const text = [programme.name, programme.category, programme.description,
                          programme.keywords, programme.days, programme.audience].join(" ").toLowerCase();
            return words.every(function (word) { return text.indexOf(word) !== -1; });
        });

        matches.sort(function (a, b) {
            switch (state.sort) {
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "category":
                    return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
                case "spots-desc":
                    return (b.volunteerSpots - a.volunteerSpots) || a.name.localeCompare(b.name);
                default:
                    return a.name.localeCompare(b.name);
            }
        });
        return matches;
    }

    /* Builds one programme card with DOM methods */
    function buildCard(programme) {
        const card = makeElement("article", "card is-new");

        const badge = makeElement("span", "badge badge-" + programme.category.toLowerCase(), programme.category);
        const heading = makeElement("h3", "", programme.name);
        const description = makeElement("p", "", programme.description);

        const when = makeElement("p", "programme-meta");
        when.appendChild(makeElement("strong", "", "When: "));
        when.appendChild(document.createTextNode(programme.days));

        const who = makeElement("p", "programme-meta");
        who.appendChild(makeElement("strong", "", "Who: "));
        who.appendChild(document.createTextNode(programme.audience));

        const spots = makeElement("p", "spots");
        if (programme.volunteerSpots > 0) {
            spots.textContent = programme.volunteerSpots + (programme.volunteerSpots === 1 ? " volunteer spot open" : " volunteer spots open");
        } else {
            spots.textContent = "Full - join the volunteer waiting list";
            spots.classList.add("spots-none");
        }

        const link = makeElement("a", "btn-outline", "Volunteer for this activity");
        link.href = "enquiry.html?activity=" + encodeURIComponent(programme.id);

        card.append(badge, heading, description, when, who, spots, link);
        return card;
    }

    /* Draws the cards. append = true only adds the next cards ("Load more"). */
    function render(append) {
        const results = getResults();
        const shown = results.slice(0, state.visible);
        const fragment = document.createDocumentFragment();   /* adds all cards to the page in one go */

        const firstNew = append ? list.children.length : 0;
        shown.slice(firstNew).forEach(function (programme) {
            fragment.appendChild(buildCard(programme));
        });

        if (!append) {
            list.replaceChildren();
        }
        list.appendChild(fragment);

        let message = "Showing " + shown.length + " of " + results.length + (results.length === 1 ? " activity" : " activities");
        if (state.search.trim() !== "") {
            message += " for \"" + state.search.trim() + "\"";
        }
        resultsCount.textContent = message;

        noResults.hidden = results.length > 0;
        loadMoreButton.hidden = shown.length >= results.length;
    }

    /* Waits until the visitor stops typing before searching */
    let typingTimer = null;
    searchInput.addEventListener("input", function () {
        window.clearTimeout(typingTimer);
        typingTimer = window.setTimeout(function () {
            state.search = searchInput.value;
            state.visible = PAGE_SIZE;
            render(false);
        }, 200);
    });

    categorySelect.addEventListener("change", function () {
        state.category = categorySelect.value;
        state.visible = PAGE_SIZE;
        render(false);
    });

    sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        state.visible = PAGE_SIZE;
        render(false);
    });

    loadMoreButton.addEventListener("click", function () {
        state.visible += PAGE_SIZE;
        render(true);
    });

    resetButton.addEventListener("click", function () {
        filterForm.reset();
        state.search = "";
        state.category = "all";
        state.sort = "name-asc";
        state.visible = PAGE_SIZE;
        render(false);
        searchInput.focus();
    });

    /* Pressing Enter in the search box must not reload the page */
    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    render(false);
}


/* ==========================================================================
   7. FORM VALIDATION ENGINE (used by both forms)
   Each rule returns an error message, or "" when the value is valid.
   ========================================================================== */

const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F' \-]{1,59}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^(\+27|0)[1-8][0-9]{8}$/;   /* 0821234567 or +27821234567 */

/* Message for a required drop-down or tick box */
function requiredRule(message) {
    return function (value, field) {
        if (field.type === "checkbox") {
            return field.checked ? "" : message;
        }
        return value.trim() === "" ? message : "";
    };
}

/* Rule for a whole number between a minimum and a maximum */
function wholeNumberRule(label, min, max) {
    return function (value) {
        const text = value.trim();
        if (text === "") {
            return "Please enter " + label + ".";
        }
        if (!/^\d+$/.test(text)) {
            return "Please enter a whole number, for example 5.";
        }
        const number = Number(text);
        if (number < min || number > max) {
            return "Please enter a number from " + min + " to " + max + ".";
        }
        return "";
    };
}

const validationRules = {
    fullName: function (value) {
        const name = value.trim();
        if (name === "") { return "Please enter your full name."; }
        if (name.length < 2) { return "Your name must have at least 2 characters."; }
        if (!NAME_PATTERN.test(name)) { return "Your name may only contain letters, spaces, hyphens and apostrophes (maximum 60 characters)."; }
        return "";
    },

    emailAddress: function (value) {
        const email = value.trim();
        if (email === "") { return "Please enter your email address."; }
        if (!EMAIL_PATTERN.test(email)) { return "Please enter a valid email address, for example name@example.com."; }
        return "";
    },

    /* The phone number is optional, but when it is typed the format must be correct */
    phoneNumber: function (value) {
        if (value.trim() === "") { return ""; }
        const cleaned = value.replace(/[\s\-()]/g, "");
        return PHONE_PATTERN.test(cleaned) ? "" : "Please enter a valid South African number, for example 082 123 4567 or +27 82 123 4567.";
    },

    enquiryType: requiredRule("Please choose an enquiry type."),
    messageType: requiredRule("Please choose the type of message."),
    programmeChoice: requiredRule("Please choose the activity you would like to help with."),
    sponsorFocus: requiredRule("Please choose what you would like to sponsor."),
    ageConfirm: requiredRule("You must be 18 years or older to sign up as a volunteer."),
    consent: requiredRule("Please tick this box so that we may reply to you."),

    /* Date: must be a real date from today up to one year ahead */
    startDate: function (value, field) {
        if (value === "" || field.validity.badInput) { return "Please choose a valid start date."; }
        const today = new Date();
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        if (value < toDateString(today)) { return "The start date cannot be in the past."; }
        if (value > toDateString(nextYear)) { return "Please choose a date within the next 12 months."; }
        return "";
    },

    childrenCount: wholeNumberRule("the number of children", 1, 150),
    monthsCount: wholeNumberRule("the number of months", 1, 12),

    /* Message: the minimum and maximum come from the minlength and maxlength attributes in the HTML */
    messageText: function (value, field) {
        const length = value.trim().length;
        if (length === 0) { return "Please type your message."; }
        if (length < field.minLength) { return "Your message is too short. Please write at least " + field.minLength + " characters (" + length + " so far)."; }
        if (length > field.maxLength) { return "Your message is too long. The maximum is " + field.maxLength + " characters."; }
        return "";
    }
};

/* Shows or clears the error message for one field */
function showFieldState(field, message) {
    const errorBox = byId(field.id + "-error");
    if (errorBox) {
        errorBox.textContent = message;
    }
    const isCheckbox = field.type === "checkbox";
    if (!isCheckbox) {
        field.classList.toggle("is-invalid", message !== "");
        field.classList.toggle("is-valid", message === "" && field.value.trim() !== "");
    }
    field.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

/* Validates one field and shows the result. Returns true when it is valid. */
function validateField(field) {
    const rule = validationRules[field.id];
    if (!rule) {
        return true;
    }
    const message = rule(field.value, field);
    showFieldState(field, message);
    return message === "";
}

/* The "days available" tick boxes: at least one must be ticked */
function validateDays(form) {
    const boxes = form.querySelectorAll("input[name='availableDays']");
    const errorBox = byId("availableDays-error");
    if (boxes.length === 0 || boxes[0].matches(":disabled")) {
        return true;
    }
    const anyTicked = Array.prototype.some.call(boxes, function (box) { return box.checked; });
    errorBox.textContent = anyTicked ? "" : "Please choose at least one day.";
    return anyTicked;
}

/* Validates every active field in the form. Returns the first invalid field (or null). */
function validateForm(form) {
    let firstInvalid = null;
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach(function (field) {
        if (field.type === "hidden" || field.name === "bot-field" || field.name === "availableDays" || field.matches(":disabled")) {
            return;
        }
        if (!validateField(field) && !firstInvalid) {
            firstInvalid = field;
        }
    });

    if (!validateDays(form) && !firstInvalid) {
        firstInvalid = form.querySelector("input[name='availableDays']");
    }
    return firstInvalid;
}

/* Checks fields while the visitor is typing and updates the character counter */
function attachLiveValidation(form) {
    form.noValidate = true;   /* our own messages are shown instead of the browser's pop-ups */

    /* When the visitor leaves a field it is checked */
    form.addEventListener("focusout", function (event) {
        const field = event.target;
        if (field.id && validationRules[field.id] && !field.matches(":disabled")) {
            validateField(field);
        }
    });

    /* While typing, a field that already shows an error is checked again so the error disappears as soon as it is fixed */
    form.addEventListener("input", function (event) {
        const field = event.target;
        if (field.id && validationRules[field.id] && field.getAttribute("aria-invalid") === "true") {
            validateField(field);
        }
        if (field.id === "messageText") {
            updateCounter(field);
        }
        if (field.name === "availableDays") {
            validateDays(form);
        }
    });

    form.addEventListener("change", function (event) {
        const field = event.target;
        if (field.tagName === "SELECT" || field.type === "checkbox" || field.type === "date") {
            if (field.name === "availableDays") {
                validateDays(form);
            } else if (validationRules[field.id]) {
                validateField(field);
            }
        }
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            clearErrors(form);
            const area = byId("messageText");
            if (area) {
                updateCounter(area);
            }
        }, 0);
    });

    const area = byId("messageText");
    if (area) {
        updateCounter(area);
    }
}

/* Removes all error messages and colours from a form */
function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach(function (box) { box.textContent = ""; });
    form.querySelectorAll(".is-invalid, .is-valid").forEach(function (field) {
        field.classList.remove("is-invalid", "is-valid");
        field.removeAttribute("aria-invalid");
    });
}

/* "42 / 500 characters (minimum 20)" */
function updateCounter(area) {
    const counter = byId("messageText-counter");
    if (counter) {
        counter.textContent = area.value.length + " / " + area.maxLength + " characters (minimum " + area.minLength + ")";
    }
}


/* ==========================================================================
   8. ENQUIRY FORM (enquiry.html)
   After validation the enquiry is processed and a response is shown
   (volunteer spots, a sponsorship cost estimate, or opening hours).
   The data is also sent with AJAX (fetch) so the page does not reload.
   ========================================================================== */

/* AJAX: sends the form data in the background and tells us whether it worked */
function sendFormWithAjax(form, formData) {
    const body = new URLSearchParams(formData).toString();
    const controller = new AbortController();
    const timeout = window.setTimeout(function () { controller.abort(); }, 8000);

    return fetch(form.getAttribute("action") || "/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
        signal: controller.signal
    }).then(function (response) {
        window.clearTimeout(timeout);
        if (!response.ok) {
            throw new Error("Server answered with status " + response.status);
        }
        return true;
    });
}

/* Creates a list of label and value pairs (<dl>) for the response panel */
function buildSummary(pairs) {
    const list = makeElement("dl", "summary-list");
    pairs.forEach(function (pair) {
        list.appendChild(makeElement("dt", "", pair[0]));
        list.appendChild(makeElement("dd", "", pair[1]));
    });
    return list;
}

/* Works out what the visitor should be told, based on the enquiry type.
   Returns { title, nodes } where nodes are the elements to show. */
function buildEnquiryResponse(data, reference) {
    const firstName = data.fullName.trim().split(/\s+/)[0];
    const nodes = [];
    const title = "Thank you, " + firstName + "!";

    if (data.enquiryType === "Volunteer Sign-Up") {
        const programme = programmeData.find(function (item) { return item.name === data.programmeChoice; });
        const days = data.availableDays.join(" and ");
        const startDate = new Date(data.startDate + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

        nodes.push(makeElement("p", "", "We have received your volunteer sign-up."));
        nodes.push(buildSummary([
            ["Activity", programme.name],
            ["Activity runs", programme.days],
            ["Your availability", days],
            ["Preferred start date", startDate],
            ["Reference number", reference]
        ]));

        /* Availability of volunteer spots */
        if (programme.volunteerSpots > 0) {
            const plural = programme.volunteerSpots === 1 ? "spot is" : "spots are";
            nodes.push(makeElement("p", "cost-total", programme.volunteerSpots + " volunteer " + plural + " available!"));
            nodes.push(makeElement("p", "", "A coordinator will contact you at " + data.emailAddress + " to confirm your start date."));
        } else {
            nodes.push(makeElement("p", "cost-total", "Waiting list"));
            nodes.push(makeElement("p", "", programme.name + " has no open volunteer spots at the moment, so we have added you to the waiting list. We will email " + data.emailAddress + " as soon as a spot opens. You are also welcome to choose another activity on our Programmes page."));
        }

        /* Warn when the chosen days do not match the days the activity runs */
        const runsWeekdays = /monday/i.test(programme.days);
        const runsWeekends = /weekend/i.test(programme.days);
        const chosenWeekdays = data.availableDays.indexOf("Weekdays after school") !== -1;
        const chosenWeekends = data.availableDays.indexOf("Weekends") !== -1;
        if (!((runsWeekdays && chosenWeekdays) || (runsWeekends && chosenWeekends))) {
            nodes.push(makeElement("p", "", "Please note: this activity runs on " + programme.days.toLowerCase() + ", which does not match the days you selected. Our coordinator will discuss the options with you."));
        }

    } else if (data.enquiryType === "Donor / Sponsor Enquiry") {
        const rate = sponsorRates[data.sponsorFocus];
        const children = Number(data.childrenCount);
        const months = Number(data.monthsCount);
        const monthly = rate.perChildPerMonth * children;
        const total = monthly * months;

        nodes.push(makeElement("p", "", "Thank you for your interest in sponsoring Rudzani Community Outreach. Here is an estimate of what your support could cover:"));
        nodes.push(buildSummary([
            ["Focus area", data.sponsorFocus],
            ["Cost per child per month", formatRand(rate.perChildPerMonth) + " (" + rate.note + ")"],
            ["Children supported", String(children)],
            ["Monthly cost", formatRand(monthly)],
            ["Number of months", String(months)],
            ["Reference number", reference]
        ]));
        nodes.push(makeElement("p", "cost-total", "Estimated total: " + formatRand(total)));
        nodes.push(makeElement("p", "", "This is an estimate only. Our team will confirm the final amount and the payment details by email at " + data.emailAddress + "."));

    } else {
        nodes.push(makeElement("p", "", "We have received your enquiry and will reply to " + data.emailAddress + " as soon as possible."));
        nodes.push(buildSummary([
            ["Enquiry type", data.enquiryType],
            ["Opening hours", "Monday - Friday: 08:00 - 20:00 | Saturday: 09:00 - 17:00"],
            ["Reference number", reference]
        ]));
        const more = makeElement("p", "", "While you wait, you can read more about our ");
        const aboutLink = makeElement("a", "text-link", "mission and vision");
        aboutLink.href = "about.html";
        const programmesLink = makeElement("a", "text-link", "community programmes");
        programmesLink.href = "programmes.html";
        more.append(aboutLink, document.createTextNode(" or explore our "), programmesLink, document.createTextNode("."));
        nodes.push(more);
    }

    return { title: title, nodes: nodes };
}

function initEnquiryForm() {
    const form = byId("enquiryForm");
    if (!form || typeof programmeData === "undefined") {
        return;
    }

    const typeSelect = byId("enquiryType");
    const volunteerFields = byId("volunteerFields");
    const sponsorFields = byId("sponsorFields");
    const programmeSelect = byId("programmeChoice");
    const sponsorSelect = byId("sponsorFocus");
    const startDate = byId("startDate");
    const submitButton = byId("enquirySubmit");
    const responsePanel = byId("enquiryResponse");
    const responseBody = byId("responseBody");
    const responseStatus = byId("responseStatus");

    attachLiveValidation(form);

    /* Fill the drop-downs from js/data.js */
    programmeData.forEach(function (programme) {
        const spots = programme.volunteerSpots > 0 ? programme.volunteerSpots + " spots open" : "waiting list";
        const option = makeElement("option", "", programme.name + " (" + spots + ")");
        option.value = programme.name;
        option.dataset.id = programme.id;
        programmeSelect.appendChild(option);
    });

    Object.keys(sponsorRates).forEach(function (name) {
        const option = makeElement("option", "", name + " - " + formatRand(sponsorRates[name].perChildPerMonth) + " per child per month");
        option.value = name;
        sponsorSelect.appendChild(option);
    });

    /* The start date can be today or up to one year ahead */
    const today = new Date();
    startDate.min = toDateString(today);
    startDate.max = toDateString(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));

    /* Shows the extra fields that belong to the chosen enquiry type.
       Fields in a disabled fieldset are not validated and not sent. */
    function showExtraFields() {
        const isVolunteer = typeSelect.value === "Volunteer Sign-Up";
        const isSponsor = typeSelect.value === "Donor / Sponsor Enquiry";

        volunteerFields.hidden = !isVolunteer;
        volunteerFields.disabled = !isVolunteer;
        sponsorFields.hidden = !isSponsor;
        sponsorFields.disabled = !isSponsor;

        [volunteerFields, sponsorFields].forEach(function (group) {
            if (group.hidden) {
                clearErrors(group);
            }
        });
    }
    typeSelect.addEventListener("change", showExtraFields);
    form.addEventListener("reset", function () {
        window.setTimeout(showExtraFields, 0);   /* the fields are cleared first, then the extra fields are hidden */
    });
    showExtraFields();

    /* Links from the Programmes page (enquiry.html?activity=maths) pre-select the volunteer option */
    const activityId = new URLSearchParams(window.location.search).get("activity");
    if (activityId) {
        const chosen = programmeData.find(function (programme) { return programme.id === activityId; });
        if (chosen) {
            typeSelect.value = "Volunteer Sign-Up";
            showExtraFields();
            programmeSelect.value = chosen.name;
        }
    }

    /* Collects the form values into a simple object */
    function readForm() {
        const formData = new FormData(form);
        return {
            fullName: formData.get("fullName") || "",
            emailAddress: formData.get("emailAddress") || "",
            phoneNumber: formData.get("phoneNumber") || "",
            enquiryType: formData.get("enquiryType") || "",
            programmeChoice: formData.get("programmeChoice") || "",
            availableDays: formData.getAll("availableDays"),
            startDate: formData.get("startDate") || "",
            sponsorFocus: formData.get("sponsorFocus") || "",
            childrenCount: formData.get("childrenCount") || "",
            monthsCount: formData.get("monthsCount") || "",
            messageText: formData.get("messageText") || ""
        };
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();   /* stops the page from reloading */

        const firstInvalid = validateForm(form);
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        /* A robot filled in the hidden field: pretend everything is fine and do nothing */
        if (form.elements["bot-field"] && form.elements["bot-field"].value !== "") {
            return;
        }

        const data = readForm();
        const reference = "ENQ-" + new Date().getFullYear() + "-" + Date.now().toString(36).slice(-5).toUpperCase();
        const response = buildEnquiryResponse(data, reference);

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        /* AJAX submission: the response is shown whether or not the server could be reached */
        sendFormWithAjax(form, new FormData(form))
            .then(function () {
                responseStatus.textContent = "Your enquiry was also sent to our team through the website.";
                responsePanel.classList.remove("is-warning");
            })
            .catch(function () {
                responseStatus.textContent = "We could not reach our server from this page, so your enquiry has not been stored. To be sure we receive it, please email " + RECIPIENT_EMAIL + " or use the Contact page.";
                responsePanel.classList.add("is-warning");
            })
            .then(function () {
                byId("responseTitle").textContent = response.title;
                responseBody.replaceChildren.apply(responseBody, response.nodes);
                form.hidden = true;
                responsePanel.hidden = false;
                responsePanel.focus();
                responsePanel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
                submitButton.disabled = false;
                submitButton.textContent = "Submit Enquiry";
            });
    });

    byId("newEnquiryBtn").addEventListener("click", function () {
        form.reset();
        showExtraFields();
        responsePanel.hidden = true;
        form.hidden = false;
        byId("fullName").focus();
    });
}


/* ==========================================================================
   9. CONTACT FORM (contact.html)
   After validation the message is compiled into an email. The visitor can
   open it in their own email app (mailto link) and send it to RECIPIENT_EMAIL.
   ========================================================================== */

/* Removes line breaks from single-line values so nobody can add extra email headers */
function singleLine(text) {
    return text.replace(/[\r\n]+/g, " ").trim();
}

function initContactForm() {
    const form = byId("contactForm");
    if (!form) {
        return;
    }

    const preview = byId("emailPreview");
    const sendLink = byId("sendEmailLink");
    const copyStatus = byId("copyStatus");
    const submitButton = byId("contactSubmit");
    let emailText = "";
    let lengthWarning = "";
    let ajaxNote = "";

    /* Both the "message is long" warning and the Netlify submission result share one status
       line, so this redraws it from whichever of the two is currently set. */
    function renderCopyStatus() {
        copyStatus.textContent = [lengthWarning, ajaxNote].filter(Boolean).join(" ");
    }

    attachLiveValidation(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstInvalid = validateForm(form);
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        /* Also try to deliver the message automatically through Netlify Forms (if this site is
           deployed on Netlify). The mailto preview below is built either way, so the visitor
           always has a way to send their message even when this background submission fails. */
        ajaxNote = "";
        submitButton.disabled = true;
        submitButton.textContent = "Preparing...";
        sendFormWithAjax(form, new FormData(form))
            .then(function () {
                ajaxNote = "Your message was also submitted directly through the website.";
            })
            .catch(function () {
                /* No Netlify Forms on this host (e.g. GitHub Pages) - the email preview below still works. */
            })
            .then(function () {
                submitButton.disabled = false;
                submitButton.textContent = "Prepare Email";
                renderCopyStatus();
            });

        const name = singleLine(form.elements.fullName.value);
        const email = singleLine(form.elements.emailAddress.value);
        const phone = singleLine(form.elements.phoneNumber.value);
        const type = form.elements.messageType.value;
        const message = form.elements.messageText.value.trim();

        /* Compile the email: subject and body */
        const subject = "[Website Contact] " + type + " from " + name;
        const body = "Hello Rudzani Community Outreach team,\n\n" +
            message + "\n\n" +
            "---\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + (phone || "Not provided") + "\n" +
            "Type of message: " + type + "\n" +
            "Sent from the Contact page of the Rudzani Community Outreach website.";

        /* encodeURIComponent makes the text safe to place inside the mailto link */
        const mailtoLink = "mailto:" + RECIPIENT_EMAIL +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body.replace(/\n/g, "\r\n"));

        byId("previewTo").textContent = RECIPIENT_EMAIL;
        byId("previewSubject").textContent = subject;
        byId("previewBody").textContent = body;
        sendLink.href = mailtoLink;
        emailText = "To: " + RECIPIENT_EMAIL + "\nSubject: " + subject + "\n\n" + body;
        lengthWarning = mailtoLink.length > 1900
            ? "Your message is long. If your email app does not open it fully, use \"Copy Email Text\" and paste it into a new email."
            : "";
        renderCopyStatus();

        preview.hidden = false;
        preview.focus();
        preview.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });

    /* Copy the email text so it can be pasted into any email app */
    byId("copyEmailBtn").addEventListener("click", function () {
        function done(success) {
            lengthWarning = success ? "Email text copied. Paste it into a new email to " + RECIPIENT_EMAIL + "." : "Copying did not work. Please select the text above and copy it yourself.";
            ajaxNote = "";
            renderCopyStatus();
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(emailText).then(function () { done(true); }, function () { done(false); });
        } else {
            /* Older browsers: copy using a temporary text box */
            const temp = document.createElement("textarea");
            temp.value = emailText;
            temp.setAttribute("readonly", "");
            temp.style.position = "absolute";
            temp.style.left = "-9999px";
            document.body.appendChild(temp);
            temp.select();
            let success = false;
            try { success = document.execCommand("copy"); } catch (error) { success = false; }
            document.body.removeChild(temp);
            done(success);
        }
    });

    byId("editMessageBtn").addEventListener("click", function () {
        form.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        form.elements.messageText.focus();
    });
}


/* ==========================================================================
   10. INTERACTIVE MAP WITH LEAFLET (contact.html)
   Map tiles come from OpenStreetMap. The Leaflet library is stored in
   js/vendor/leaflet so the page does not depend on an extra website.
   ========================================================================== */

/* Haversine formula: distance in kilometres between two latitude/longitude points */
function distanceInKm(lat1, lng1, lat2, lng2) {
    const radius = 6371;
    const toRad = function (degrees) { return degrees * Math.PI / 180; };
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initMap() {
    const mapElement = byId("map");
    if (!mapElement || typeof organisation === "undefined") {
        return;
    }

    /* If the Leaflet library did not load, show the address as text instead */
    if (typeof L === "undefined") {
        mapElement.appendChild(makeElement("p", "", "The map could not be loaded. Our address is " + organisation.address + "."));
        return;
    }

    const position = [organisation.lat, organisation.lng];
    L.Icon.Default.imagePath = "js/vendor/leaflet/images/";

    const map = L.map(mapElement, { scrollWheelZoom: false }).setView(position, 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener noreferrer\">OpenStreetMap</a> contributors"
    }).addTo(map);

    /* Pop-up above the marker */
    const popup = makeElement("div");
    popup.appendChild(makeElement("strong", "", organisation.name));
    popup.appendChild(document.createElement("br"));
    popup.appendChild(document.createTextNode(organisation.address));

    const marker = L.marker(position, { title: organisation.name, alt: "Location of " + organisation.name }).addTo(map);
    marker.bindPopup(popup).openPopup();

    /* Scroll-wheel zoom only works after the map is clicked, so the page can still be scrolled */
    map.on("focus", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });

    /* The directions link opens Google Maps with the destination filled in */
    const directions = byId("directionsLink");
    if (directions) {
        directions.href = "https://www.google.com/maps/dir/?api=1&destination=" + organisation.lat + "," + organisation.lng;
    }

    /* Location-based feature: how far is the visitor from the organisation? */
    const distanceButton = byId("distanceBtn");
    const distanceResult = byId("distanceResult");
    let visitorMarker = null;

    if (distanceButton) {
        distanceButton.addEventListener("click", function () {
            if (!navigator.geolocation) {
                distanceResult.textContent = "Your browser does not support location services. Please use Get Directions instead.";
                return;
            }

            distanceResult.textContent = "Finding your location...";
            navigator.geolocation.getCurrentPosition(function (result) {
                const lat = result.coords.latitude;
                const lng = result.coords.longitude;
                const km = distanceInKm(lat, lng, organisation.lat, organisation.lng);

                distanceResult.textContent = "You are about " + km.toFixed(1) + " km from our area in Thohoyandou.";

                if (visitorMarker) {
                    map.removeLayer(visitorMarker);
                }
                visitorMarker = L.circleMarker([lat, lng], { radius: 9, color: "#2d6a4f", fillColor: "#f5b942", fillOpacity: 0.9 })
                    .addTo(map)
                    .bindTooltip("You are here");
                map.fitBounds([position, [lat, lng]], { padding: [40, 40], maxZoom: 14 });
            }, function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    distanceResult.textContent = "Location permission was denied. You can still use Get Directions.";
                } else {
                    distanceResult.textContent = "We could not find your location. Please try Get Directions instead.";
                }
            }, { timeout: 10000 });
        });
    }

    /* Makes sure the map fills its box after the page has finished loading */
    window.addEventListener("load", function () {
        map.invalidateSize();
    });
}


/* ==========================================================================
   11. START-UP
   Each function checks that its own elements exist, so one file can be used by every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initBackToTop();
    initCounters();
    initModal();
    initLightbox();
    initProgrammes();
    initEnquiryForm();
    initContactForm();
    initMap();

    /* jQuery parts (tabs and accordion) */
    if (window.jQuery) {
        window.jQuery.fx.off = prefersReducedMotion;
        window.jQuery(function ($) {
            initTabs($);
            initAccordion($);
        });
    }
});
