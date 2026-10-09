function closeNotification() {

    document.getElementById("notification").style.display = "none";

}

function openModal() {

    document.getElementById("modal").style.display = "block";

}

function closeModal() {

    document.getElementById("modal").style.display = "none";

}

function showAnswer(id) {

    var answer = document.getElementById(id);

    if (answer.style.display === "none") {

        answer.style.display = "block";

    } else {

        answer.style.display = "none";

    }

}

var slideNumber = 1;

function nextSlide() {

    slideNumber++;

    if (slideNumber > 3) {

        slideNumber = 1;

    }

    showSlide();

}

function previousSlide() {

    slideNumber--;

    if (slideNumber < 1) {

        slideNumber = 3;

    }

    showSlide();

}

function showSlide() {

    document.getElementById("slide1").style.display = "none";

    document.getElementById("slide2").style.display = "none";

    document.getElementById("slide3").style.display = "none";

    document.getElementById("slide" + slideNumber).style.display = "block";

}

function changeTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

}

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

}

//p6 onwards:
let eventSearchBox =
    document.getElementById("searchInput");

let eventCategoryFilter =
    document.getElementById("categoryFilter");

let eventSort =
    document.getElementById("sortEvents");

let eventList =
    document.getElementById("eventList");

let eventPrev =
    document.getElementById("prevPage");

let eventNext =
    document.getElementById("nextPage");

let eventPageNumber =
    document.getElementById("pageNumber");


if (
    eventSearchBox &&
    eventCategoryFilter &&
    eventSort &&
    eventList &&
    eventPrev &&
    eventNext &&
    eventPageNumber
) {

    let allEvents = [];

    let currentEventPage = 1;

    let eventsPerPage = 5;


    // ========================================
    // Display Events
    // ========================================

    function displayEvents() {

        let searchText =
            eventSearchBox.value.toLowerCase();

        let selectedCategory =
            eventCategoryFilter.value;

        let selectedSort =
            eventSort.value;


        // ========================================
        // Search and Filter
        // ========================================

        let filteredEvents =
            allEvents.filter(function(event) {

                let titleMatches =
                    event.title
                        .toLowerCase()
                        .includes(searchText);

                let categoryMatches =
                    selectedCategory === "all" ||
                    event.category === selectedCategory;

                return (
                    titleMatches &&
                    categoryMatches
                );

            });


        // ========================================
        // Sorting
        // ========================================

        filteredEvents.sort(function(a, b) {

            if (selectedSort === "az") {

                return a.title.localeCompare(
                    b.title
                );

            }

            if (selectedSort === "za") {

                return b.title.localeCompare(
                    a.title
                );

            }

            if (selectedSort === "dateAsc") {

                return new Date(a.date) -
                       new Date(b.date);

            }

            if (selectedSort === "dateDesc") {

                return new Date(b.date) -
                       new Date(a.date);

            }

            return a.id - b.id;

        });


        // ========================================
        // Pagination
        // ========================================

        let totalPages =
            Math.ceil(
                filteredEvents.length /
                eventsPerPage
            );


        if (totalPages === 0) {

            totalPages = 1;

        }


        if (currentEventPage > totalPages) {

            currentEventPage = totalPages;

        }


        let startIndex =
            (currentEventPage - 1) *
            eventsPerPage;


        let endIndex =
            startIndex +
            eventsPerPage;


        let pageEvents =
            filteredEvents.slice(
                startIndex,
                endIndex
            );


        // ========================================
        // Render Events
        // ========================================

        eventList.innerHTML = "";


        if (pageEvents.length === 0) {

            eventList.innerHTML =
                "<p>No events found.</p>";

        }

        else {

            pageEvents.forEach(function(event) {

                let eventCard =
                    document.createElement("article");


                eventCard.innerHTML =
                    "<h3>" +
                    event.title +
                    "</h3>" +

                    "<p><strong>Date:</strong> " +
                    event.date +
                    "</p>" +

                    "<p><strong>Location:</strong> " +
                    event.location +
                    "</p>" +

                    "<p><strong>Category:</strong> " +
                    event.category +
                    "</p>";


                eventList.appendChild(
                    eventCard
                );

            });

        }


        // ========================================
        // Update Pagination
        // ========================================

        eventPageNumber.innerHTML =
            "Page " +
            currentEventPage +
            " of " +
            totalPages;


        eventPrev.disabled =
            currentEventPage === 1;


        eventNext.disabled =
            currentEventPage === totalPages;

    }


    // ========================================
    // Fetch Events JSON
    // ========================================

    eventList.innerHTML =
        "Loading events...";


    fetch("../data/events.json")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load events."
                );

            }

            return response.json();

        })

        .then(function(events) {

    allEvents = events;

    document.getElementById("loadingMessage").innerHTML = "";

    displayEvents();

})

        .catch(function(error) {

            eventList.innerHTML =
                "Sorry, events could not be loaded.";

            console.log(error);

        });


    // ========================================
    // Search
    // ========================================

    eventSearchBox.addEventListener(
        "input",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );


    // ========================================
    // Category Filter
    // ========================================

    eventCategoryFilter.addEventListener(
        "change",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );


    // ========================================
    // Sorting
    // ========================================

    eventSort.addEventListener(
        "change",
        function() {

            currentEventPage = 1;

            displayEvents();

        }
    );


    // ========================================
    // Previous Page
    // ========================================

    eventPrev.addEventListener(
        "click",
        function() {

            if (currentEventPage > 1) {

                currentEventPage--;

                displayEvents();

            }

        }
    );


    // ========================================
    // Next Page
    // ========================================

    eventNext.addEventListener(
        "click",
        function() {

            if (currentEventPage < 1000) {

                currentEventPage++;

                displayEvents();

            }

        }
    );

}
// ========================================
// Practical 6 - Student Profiles
// Fetch + Search + Filter + Sort + Pagination
// ========================================

let studentList =
    document.getElementById("studentList");

let studentSearchBox =
    document.getElementById("studentSearch");

let studentCourseFilter =
    document.getElementById("courseFilter");

let studentYearFilter =
    document.getElementById("yearFilter");

let studentSort =
    document.getElementById("studentSort");

let studentPrev =
    document.getElementById("studentPrev");

let studentNext =
    document.getElementById("studentNext");

let studentPageNumber =
    document.getElementById("studentPageNumber");


if (
    studentList &&
    studentSearchBox &&
    studentCourseFilter &&
    studentYearFilter &&
    studentSort &&
    studentPrev &&
    studentNext &&
    studentPageNumber
) {

    let allStudents = [];

    let currentStudentPage = 1;

    let studentsPerPage = 5;


    // ========================================
    // Display Students
    // ========================================

    function displayStudents() {

        let searchText =
            studentSearchBox.value.toLowerCase();

        let selectedCourse =
            studentCourseFilter.value;

        let selectedYear =
            studentYearFilter.value;

        let selectedSort =
            studentSort.value;


        // ========================================
        // Search and Filter
        // ========================================

        let filteredStudents =
            allStudents.filter(function(student) {

                let nameMatches =
                    student.name
                        .toLowerCase()
                        .includes(searchText);

                let courseMatches =
                    selectedCourse === "all" ||
                    student.course === selectedCourse;

                let yearMatches =
                    selectedYear === "all" ||
                    String(student.year) === selectedYear;


                return (
                    nameMatches &&
                    courseMatches &&
                    yearMatches
                );

            });


        // ========================================
        // Sorting
        // ========================================

        filteredStudents.sort(function(a, b) {

            if (selectedSort === "az") {

                return a.name.localeCompare(b.name);

            }

            if (selectedSort === "za") {

                return b.name.localeCompare(a.name);

            }

            if (selectedSort === "yearAsc") {

                return a.year - b.year;

            }

            if (selectedSort === "yearDesc") {

                return b.year - a.year;

            }

            return a.id - b.id;

        });


        // ========================================
        // Pagination
        // ========================================

        let totalPages =
            Math.ceil(
                filteredStudents.length /
                studentsPerPage
            );


        if (totalPages === 0) {

            totalPages = 1;

        }


        if (currentStudentPage > totalPages) {

            currentStudentPage = totalPages;

        }


        let startIndex =
            (currentStudentPage - 1) *
            studentsPerPage;

        let endIndex =
            startIndex +
            studentsPerPage;


        let pageStudents =
            filteredStudents.slice(
                startIndex,
                endIndex
            );


        // ========================================
        // Render Students
        // ========================================

        studentList.innerHTML = "";


        if (pageStudents.length === 0) {

            studentList.innerHTML =
                "<p>No students found.</p>";

        }

        else {

            pageStudents.forEach(function(student) {

                let studentCard =
                    document.createElement("article");


                studentCard.innerHTML =
                    "<h3>" +
                    student.name +
                    "</h3>" +

                    "<p><strong>Email:</strong> " +
                    student.email +
                    "</p>" +

                    "<p><strong>Course:</strong> " +
                    student.course +
                    "</p>" +

                    "<p><strong>Year:</strong> " +
                    student.year +
                    "</p>";


                studentList.appendChild(
                    studentCard
                );

            });

        }


        // ========================================
        // Update Pagination
        // ========================================

        studentPageNumber.innerHTML =
            "Page " +
            currentStudentPage +
            " of " +
            totalPages;


        studentPrev.disabled =
            currentStudentPage === 1;


        studentNext.disabled =
            currentStudentPage === totalPages;

    }


    // ========================================
    // Fetch Students JSON
    // ========================================

    studentList.innerHTML =
        "Loading students...";


    fetch("../data/students.json")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load students."
                );

            }

            return response.json();

        })

        .then(function(students) {

            allStudents = students;

            displayStudents();

        })

        .catch(function(error) {

            studentList.innerHTML =
                "Sorry, students could not be loaded.";

            console.log(error);

        });


    // ========================================
    // Search
    // ========================================

    studentSearchBox.addEventListener(
        "input",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );


    // ========================================
    // Course Filter
    // ========================================

    studentCourseFilter.addEventListener(
        "change",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );


    // ========================================
    // Year Filter
    // ========================================

    studentYearFilter.addEventListener(
        "change",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );


    // ========================================
    // Sorting
    // ========================================

    studentSort.addEventListener(
        "change",
        function() {

            currentStudentPage = 1;

            displayStudents();

        }
    );


    // ========================================
    // Previous Page
    // ========================================

    studentPrev.addEventListener(
        "click",
        function() {

            if (currentStudentPage > 1) {

                currentStudentPage--;

                displayStudents();

            }

        }
    );


    // ========================================
    // Next Page
    // ========================================

    studentNext.addEventListener(
        "click",
        function() {

            currentStudentPage++;

            displayStudents();

        }
    );

}

// ========================================
// Practical 6 - FAQ Section
// Fetch + Search + Sort + Pagination
// ========================================

let faqList =
    document.getElementById("faqList");

let faqSearchBox =
    document.getElementById("faqSearch");

let faqSort =
    document.getElementById("faqSort");

let faqPrev =
    document.getElementById("faqPrev");

let faqNext =
    document.getElementById("faqNext");

let faqPageNumber =
    document.getElementById("faqPageNumber");


if (
    faqList &&
    faqSearchBox &&
    faqSort &&
    faqPrev &&
    faqNext &&
    faqPageNumber
) {

    let allFAQs = [];

    let currentFAQPage = 1;

    let faqsPerPage = 5;


    // ========================================
    // Display FAQs
    // ========================================

    function displayFAQs() {

        let searchText =
            faqSearchBox.value.toLowerCase();

        let selectedSort =
            faqSort.value;


        // ========================================
        // Search FAQs
        // ========================================

        let filteredFAQs =
            allFAQs.filter(function(faq) {

                let questionMatches =
                    faq.question
                        .toLowerCase()
                        .includes(searchText);

                return questionMatches;

            });


        // ========================================
        // Sort FAQs
        // ========================================

        filteredFAQs.sort(function(a, b) {

            if (selectedSort === "az") {

                return a.question.localeCompare(
                    b.question
                );

            }

            if (selectedSort === "za") {

                return b.question.localeCompare(
                    a.question
                );

            }

            return a.id - b.id;

        });


        // ========================================
        // Pagination
        // ========================================

        let totalPages =
            Math.ceil(
                filteredFAQs.length /
                faqsPerPage
            );


        if (totalPages === 0) {

            totalPages = 1;

        }


        if (currentFAQPage > totalPages) {

            currentFAQPage = totalPages;

        }


        let startIndex =
            (currentFAQPage - 1) *
            faqsPerPage;

        let endIndex =
            startIndex +
            faqsPerPage;


        let pageFAQs =
            filteredFAQs.slice(
                startIndex,
                endIndex
            );


        // ========================================
        // Render FAQs
        // ========================================

        faqList.innerHTML = "";


        if (pageFAQs.length === 0) {

            faqList.innerHTML =
                "<p>No FAQs found.</p>";

        }

        else {

            pageFAQs.forEach(function(faq) {

                let faqCard =
                    document.createElement("article");


                faqCard.innerHTML =
                    "<h3>" +
                    faq.question +
                    "</h3>" +

                    "<p>" +
                    faq.answer +
                    "</p>";


                faqList.appendChild(
                    faqCard
                );

            });

        }


        // ========================================
        // Update Pagination
        // ========================================

        faqPageNumber.innerHTML =
            "Page " +
            currentFAQPage +
            " of " +
            totalPages;


        faqPrev.disabled =
            currentFAQPage === 1;


        faqNext.disabled =
            currentFAQPage === totalPages;

    }


    // ========================================
    // Fetch FAQs JSON
    // ========================================

    faqList.innerHTML =
        "Loading FAQs...";


    fetch("../data/faqs.json")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load FAQs."
                );

            }

            return response.json();

        })

        .then(function(faqs) {

            allFAQs = faqs;

            displayFAQs();

        })

        .catch(function(error) {

            faqList.innerHTML =
                "Sorry, FAQs could not be loaded.";

            console.log(error);

        });


    // ========================================
    // Search
    // ========================================

    faqSearchBox.addEventListener(
        "input",
        function() {

            currentFAQPage = 1;

            displayFAQs();

        }
    );


    // ========================================
    // Sorting
    // ========================================

    faqSort.addEventListener(
        "change",
        function() {

            currentFAQPage = 1;

            displayFAQs();

        }
    );


    // ========================================
    // Previous Page
    // ========================================

    faqPrev.addEventListener(
        "click",
        function() {

            if (currentFAQPage > 1) {

                currentFAQPage--;

                displayFAQs();

            }

        }
    );


    // ========================================
    // Next Page
    // ========================================

    faqNext.addEventListener(
        "click",
        function() {

            currentFAQPage++;

            displayFAQs();

        }
    );

}