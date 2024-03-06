"use strict";

class TabellaSemine extends HTMLElement {

    static observedAttributes = ["search", "depth", "moon", "sun"];

    constructor() {
        super();

        // Initialize the properties
        this.data = {};
        this.monthsNames = ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'];
    }

    connectedCallback() {
        this.renderTable();
        this.fetchData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.fetchData();
        console.log(
            `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
        );
    }

    /**
     * Check if any filter is active.
     * @returns bool
     */
    hasFilters() {
        return this.getAttribute('search') 
            || this.getAttribute('depth') 
            || this.getAttribute('moon') 
            || this.getAttribute('sun')
    }

    /**
     * Fetch the data from the json file.
     * @returns void
     */
    fetchData() {
        fetch('./js/data.json')
            .then((response) => response.json())
            .then((responseData) => {
                this.data = responseData;
                this.renderTbody();
            })
            .catch((error) => console.error("Error loading JSON file", error));
    }

    /**
     * Renders the table.
     * @returns void
     */
    renderTable() {
        this.table = document.createElement("table");
        this.table.classList.add('striped');
        this.table.setAttribute('role', 'row');
        this.thead = document.createElement("thead");
        this.table.appendChild(this.thead);
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);
        this.appendChild(this.table);

        this.renderThead();
        this.renderTbody();
    }

    /**
     * Renders the table head content.
     * @returns void
     */
    renderThead() {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.textContent = '';
        th.setAttribute('scope', 'row');
        tr.appendChild(th);

        // Add the columns for the months
        this.monthsNames.forEach((month) => {
            th = document.createElement("th");
            th.textContent = month;
            th.setAttribute('scope', 'row');
            tr.appendChild(th);
        });

        // Add moon column
        th = document.createElement("th");
        th.textContent = 'Luna';
        th.setAttribute('scope', 'row');
        tr.appendChild(th);

        // Add depth column
        th = document.createElement("th");
        th.innerHTML = '<img src="img/arrow-bar-down.svg" alt="Profondità" />';
        th.setAttribute('scope', 'row');
        tr.appendChild(th);
        
        // Add distance column
        th = document.createElement("th");
        th.innerHTML = '<img src="img/arrows-move.svg" alt="Distanza" />';
        th.setAttribute('scope', 'row');
        tr.appendChild(th);

        // Add sun column
        th = document.createElement("th");
        th.textContent = 'Sole';
        th.setAttribute('scope', 'row');
        tr.appendChild(th);

        this.thead.appendChild(tr);
    }

    /**
     * Renders the table body content.
     * @returns void
     */
    renderTbody() {
        // Initializate the variables used in the loops
        let tr, th, td;

        // Empty the tbody
        this.tbody.innerHTML = '';

        if (typeof this.data !== 'object' || !Object.keys(this.data).length) {
            tr = document.createElement("tr");
            th = document.createElement("th");
            th.textContent = 'Nessun dato';
            th.setAttribute('colspan', 17);
            th.style.textAlign = 'center';
            tr.appendChild(th);
            this.tbody.appendChild(tr);

            return;
        }

        const searchFilter = this.getAttribute('search');
        const depthFilter = Number(this.getAttribute('depth'));
        const moonFilter = Number(this.getAttribute('moon'));
        const sunFilter = Number(this.getAttribute('sun'));
        
        for (const vegetable in this.data) {
            if (Object.hasOwn(this.data, vegetable)) {

                // Apply filters
                if (searchFilter && !this.data[vegetable].name.toLowerCase().includes(searchFilter)) {
                    continue;
                }
                if (depthFilter && this.data[vegetable].depth < depthFilter) {
                    continue;
                }
                if (moonFilter && this.data[vegetable].moon !== moonFilter) {
                    continue;
                }
                if (sunFilter && this.data[vegetable].sun !== sunFilter) {
                    continue;
                }

                // Add the vagetable name column
                tr = document.createElement("tr");
                th = document.createElement("th");
                th.textContent = this.data[vegetable].name;
                th.setAttribute('scope', 'row');
                tr.appendChild(th);

                const works = this.data[vegetable].works;
                for (let month = 0; month < 12; month++) {
                    // Create a column for each month
                    td = document.createElement("td");

                    // For each work type add the corresponding bar
                    for (const i in works) {
                        if (Object.hasOwn(works, i) && Object.values(works[i]).length) {
                            let span;
                            // First array element represents the left side
                            if (works[i][month][0]) {
                                span = document.createElement("span");
                                span.style.left = 0;
                                span.style.width = works[i][month][0] + '%';
                            }

                            // Second array element represents the right side
                            if (works[i][month][1]) {
                                span = document.createElement("span");
                                span.style.right = 0;
                                span.style.width = works[i][month][1] + '%';
                            }

                            // If the span was valorized, add a style class and add the bar to the row
                            if (span) {
                                span.classList.add(i);
                                td.appendChild(span);
                            }
                        }
                    }

                    tr.appendChild(td);
                }

                // Add moon column
                td = document.createElement("td");
                let moonIcon, moonText;
                if (this.data[vegetable].moon === 1) {
                    moonIcon = 'moon';
                    moonText = 'Luna calante';
                } else if (this.data[vegetable].moon === 2) {
                    moonIcon = 'moon-filled';
                    moonText = 'Luna crescente';
                }
                td.innerHTML = '<img src="img/'+ moonIcon +'.svg" alt="'+ moonText +'" data-tooltip="'+ moonText +'" />';
                tr.appendChild(td);

                // Add depth column
                td = document.createElement("td");
                td.textContent = this.data[vegetable].depth;
                tr.appendChild(td);

                // Add distance column
                td = document.createElement("td");
                td.textContent = this.data[vegetable].distance;
                tr.appendChild(td);
                
                // Add sun column
                td = document.createElement("td");
                
                let sunIcon, sunText;
                if (this.data[vegetable].sun === 1) {
                    sunIcon = 'sun-low';
                    sunText = 'Poco soleggiato';
                } else if (this.data[vegetable].sun === 2) {
                    sunIcon = 'sun';
                    sunText = 'Soleggiato';
                } else if (this.data[vegetable].sun === 3) {
                    sunIcon = 'sun-filled';
                    sunText = 'Molto soleggiato';
                }
                td.innerHTML = '<img src="img/' + sunIcon + '.svg" alt="'+ sunText +'" data-tooltip="'+ sunText +'" />';
                tr.appendChild(td);

                this.tbody.appendChild(tr);
            }
        }
    }
}

// Register the custom element
customElements.define("tabella-semine", TabellaSemine);

document.addEventListener('DOMContentLoaded', function() {
    // Get the custom table reference
    const tableEl = document.querySelector('tabella-semine');

    // Register events for all inputs to filter the table
    document.querySelectorAll('input, select').forEach((el) => {
        el.addEventListener("change", (event) => {
            event.preventDefault();
            tableEl.setAttribute(el.name, el.value);
        });
    });
});