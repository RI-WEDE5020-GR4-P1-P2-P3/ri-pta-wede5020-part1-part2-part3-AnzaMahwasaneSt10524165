/* ==========================================================================
   Rudzani Community Outreach - data.js (Part 3)
   Content used by script.js to build the page dynamically (DOM manipulation).
   The data is kept in a JavaScript file (not a .json file) so the website
   also works when index.html is opened straight from the folder (file://),
   because browsers block fetch() on local files.

   NOTE: the volunteer spots and sponsorship rates below are SAMPLE values
   created for this assignment. The organisation can change them here and
   every page will update automatically.
   ========================================================================== */

/* --- Programme activities (used on programmes.html and in the enquiry form) --- */
const programmeData = [
    {
        id: "daily-meals",
        name: "Daily Hot Meals",
        category: "Nutrition",
        days: "Monday to Friday, after school",
        audience: "Local children from low-income households",
        description: "Balanced hot meals served every school day to over 150 local children so that hunger never gets in the way of learning.",
        volunteerSpots: 6,
        keywords: "feeding scheme food meals hunger nutrition children"
    },
    {
        id: "homework-support",
        name: "Homework Support",
        category: "Tutoring",
        days: "Monday to Friday, after school",
        audience: "Learners in Grades 4 to 12",
        description: "Volunteer tutors sit with learners to complete homework and understand the work that was taught in class.",
        volunteerSpots: 8,
        keywords: "homework help study support after school tutoring"
    },
    {
        id: "mathematics-tutoring",
        name: "Mathematics Tutoring",
        category: "Tutoring",
        days: "Monday to Friday, after school",
        audience: "Learners in Grades 4 to 12",
        description: "Free mathematics lessons that build strong foundations, from basic number work up to Grade 12 content.",
        volunteerSpots: 3,
        keywords: "maths math numeracy free tutoring"
    },
    {
        id: "english-literacy",
        name: "English Literacy",
        category: "Tutoring",
        days: "Monday to Friday, after school",
        audience: "Learners in Grades 4 to 12",
        description: "Reading, writing and speaking support in English to help learners understand every subject in the classroom.",
        volunteerSpots: 4,
        keywords: "english reading writing literacy language"
    },
    {
        id: "science-support",
        name: "Science Support",
        category: "Tutoring",
        days: "Monday to Friday, after school",
        audience: "Primary and high school learners",
        description: "Simple explanations and practical examples that make science easier to understand and enjoy.",
        volunteerSpots: 2,
        keywords: "science physical natural sciences tutoring"
    },
    {
        id: "exam-preparation",
        name: "Exam Preparation",
        category: "Tutoring",
        days: "Monday to Friday, after school",
        audience: "Learners in Grades 4 to 12",
        description: "Revision sessions, past papers and study techniques to help learners feel confident before examinations.",
        volunteerSpots: 5,
        keywords: "exams revision past papers study skills matric"
    },
    {
        id: "computer-skills",
        name: "Computer Skills Bootcamp",
        category: "Workshops",
        days: "Weekends",
        audience: "Teenagers",
        description: "An interactive weekend bootcamp that teaches basic computer usage and digital literacy.",
        volunteerSpots: 2,
        keywords: "computer digital literacy technology weekend bootcamp"
    },
    {
        id: "career-guidance",
        name: "Career Guidance",
        category: "Workshops",
        days: "Weekends",
        audience: "Teenagers",
        description: "Workshops that help teenagers explore career options, subject choices and ways to study after school.",
        volunteerSpots: 0,
        keywords: "career guidance future study bursaries weekend"
    },
    {
        id: "leadership-skills",
        name: "Leadership Skills",
        category: "Workshops",
        days: "Weekends",
        audience: "Teenagers",
        description: "Practical activities that build confidence, teamwork and personal growth in young leaders.",
        volunteerSpots: 3,
        keywords: "leadership confidence teamwork personal growth youth empowerment"
    }
];

/* --- Sponsorship cost per child per month (sample rates in South African Rand) --- */
const sponsorRates = {
    "Daily Hot Meals": { perChildPerMonth: 440, note: "about R20 a meal for 22 school days" },
    "Tutoring Materials": { perChildPerMonth: 150, note: "books, stationery and printing" },
    "Weekend Workshops": { perChildPerMonth: 200, note: "facilitators, refreshments and materials" }
};

/* --- Programme "quick view" details used by the modal on index.html --- */
const quickViewData = {
    nutrition: {
        title: "Daily Nutrition",
        image: "images/children-smiling-daily-nutrition-thumb.webp",
        alt: "Smiling children who receive a daily nutritious meal in Tshisaulu",
        text: "We serve balanced hot meals from Monday to Friday after school to over 150 local children. A full stomach helps learners concentrate, so meals are the foundation of everything else we do.",
        link: "programmes.html",
        linkText: "See all programmes"
    },
    tutoring: {
        title: "After-School Tutoring",
        image: "images/after-school-tutoring-classroom-thumb.webp",
        alt: "Learners in a classroom during after-school tutoring",
        text: "Volunteer tutors support learners from Grade 4 to Grade 12 with homework, examination preparation, English literacy, Mathematics and Science.",
        link: "enquiry.html",
        linkText: "Volunteer as a tutor"
    },
    workshops: {
        title: "Youth Workshops",
        image: "images/youth-empowerment-friends-workshop-thumb.webp",
        alt: "A group of young people sitting together with their arms around each other",
        text: "Held on weekends, our interactive bootcamps teach basic computer usage, career guidance and leadership skills to teenagers in the community.",
        link: "enquiry.html",
        linkText: "Sponsor a workshop"
    }
};

/* --- Organisation details used by the map and the contact form --- */
const organisation = {
    name: "Rudzani Community Outreach",
    email: "info@rudzanioutreach.org.za",
    address: "Main Road, Tshisaulu, Thohoyandou, Limpopo, South Africa",
    /* Approximate map position (centre of Thohoyandou). Replace with the exact
       latitude and longitude of the organisation if it is known. */
    lat: -22.9456,
    lng: 30.4850
};
