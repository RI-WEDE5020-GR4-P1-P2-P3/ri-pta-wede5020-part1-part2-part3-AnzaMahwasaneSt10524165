[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PhWn_eB9)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24295459&assignment_repo_type=AssignmentRepo)


# Rudzani Community Outreach - Website Development

Table of Contents
Project Overview
Proposal Summary
File and Folder Structure
Technologies Used
Pages Description
How to View the Website
Screenshots
Changelog
References

## 1 Project Overview
An interactive, responsive website for **Rudzani Community Outreach**, a registered Non-Profit Organisation (NPO) founded in 2018 in Tshisaulu, Thohoyandou, Limpopo. The website serves as a digital presence to inform parents, volunteers, corporate sponsors, and community members about youth empowerment programmes and daily nutritional support.

This project was developed as a Portfolio of Evidence (PoE) submission for the Diploma in Information Technology in Software Development at The IIE's Rosebank College.

## 2 Proposal summary

## 2 Built With
* **HTML5:** Semantic structuring and multi-page routing.
* **CSS3:** Custom styling, CSS Variables, Flexbox, and CSS Grid layout models.
* **Google Fonts:** Utilizing 'Nunito' for modern typography.
* **Responsive Design:** Mobile-first media queries for cross-device compatibility.

## 2 How to View the Website

### Option A: Local Browser
1. Clone or download the repository to your local machine.
2. Navigate to the project folder.
3. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox).

### Option B: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

## 3 Repository Structure
├── css/
│   └── style.css
├── images/
│   ├── desktop screenshot.png
│   ├── tablet  screenshot.png
│   ├── mobile  screenshot.png
│   ├── Daily nutrition.png
│   ├── After school tutoring...
│   └── Youth empowerment...
├── Videos/
│   ├── Daily nutrition...
│   ├── Learning.mp4.mp4
│   └── ...
├── about.html
├── contact.html
├── enquiry.html
├── index.html
├── programmes.html
└── README.md

###PART 1
* **Added** Added 5 files(index.html, about.html, enquiry.html, programmes.html,contact.html)
* **Added** Footers and headers
* **Added** Div classes
* **Added** images folder


PART 2

## 4 Changelog

### [v1.1.0] - Part 2 Layout & Responsive Upgrade
* **Added:** CSS file and a link all five HTML pages

* **Added:**  I made a design token using(:root), A CSS variables for all colours using(--colour-ink,--colour forest,--color-sage,--colour-sunlight,--colour-paper and --colour-cloud) 

* **Added:** "Our Goal" card section to `about.html`

* **Added:** Applied a universal box-sizing: border-box reset,reset(margain)and(padding)on all elements,set(scroll-behavior:smooth)on(html) I also applied(display: flex; flex-direction: column; min-height: 100vh)on(body)

* **Added** I add (:hover),(:focus)and(:active)states for navigation links(background colour change),(btn-action) buttonsinversion to forest green on hover, focus ring, pressed darkening on active card elements (raised shadow on hover), and all form inputs (border colour change on hover, focus ring and glow on focus).

* **Added**Implemented Flexbox layout for the header (justify-content: space-between, align-items: center) and navigation (flex-wrap, gap). Implemented CSS Grid for the .card-grid (grid-template-columns: repeat(3, 1fr), gap). Used display: flex; flex-direction: column on individual cards and the enquiry form. Hero section uses display: flex; flex-direction: column; align-items: center.

* **Added** I added Topography style:Imported the Nunito typeface from Google Fonts 

* **Added** Implemented responsive `@media` query rules to stack page elements cleanly on mobile viewports
* **Added** type="video/mp4" to all <source> elements.


####FIXED
Linked missing `style.css` file on `about.html` to resolve standard vertical list rendering.
Changed control to controls on all three video elements.
Added the missing </article> closing tag after the third card's paragraph.
Standardised all five HTML files to href="css/style.css" (lowercase css/).
Added the missing </div> closing tag after the third article, before </main>.
Added name="fullName", name="emailAddress", name="enquiryType", and name="messageText" to the respective elements. Also added required attributes to enforce HTML5 native validation as a secondary layer alongside the JavaScript validation.


## Part 2 Evidence Screenshots

### Desktop View (1024px+)
![Desktop Layout](./images/desktop%20screenshot.png)
### Tablet View (768px - 1023px)
![Tablet Layout](./images/tablet%20screenshot.png)
### Mobile View (767px and below)
![Mobile Layout](./images/tablet%20screenshot.png)

#### REFERENCES
Google Fonts. (2024). Nunito. https://fonts.google.com/specimen/Nunito
Pexels. (2024). Free stock videos. https://www.pexels.com
GitHub Docs. (2024). About commits. https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits
MDN Web Docs. (2024). CSS: Cascading Style Sheets. Mozilla. https://developer.mozilla.org/en-US/docs/Web/CSS
