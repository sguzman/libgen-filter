// ==UserScript==
// @name         Libgen Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter libgen search results by extension, language, title, etc.
// @author       You
// @match        *://libgen.is/search.php*
// @match        *://libgen.rs/search.php*
// @match        *://libgen.st/search.php*
// @match        *://gen.lib.rus.ec/search.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create UI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    container.style.fontFamily = 'sans-serif';
    container.style.fontSize = '14px';
    container.style.borderRadius = '5px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';

    const header = document.createElement('div');
    header.innerText = 'Libgen Filters';
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    header.style.marginBottom = '5px';
    container.appendChild(header);

    const createInputGroup = (labelText) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.justifyContent = 'space-between';
        label.style.alignItems = 'center';
        label.innerText = labelText + ': ';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.style.marginLeft = '10px';
        input.style.width = '120px';
        
        label.appendChild(input);
        container.appendChild(label);
        
        return input;
    };

    const titleInput = createInputGroup('Title');
    const langInput = createInputGroup('Language');
    const extInput = createInputGroup('Extension');

    document.body.appendChild(container);

    // 2. Filter logic
    function applyFilters() {
        const titleFilter = titleInput.value.toLowerCase();
        const langFilter = langInput.value.toLowerCase();
        const extFilter = extInput.value.toLowerCase();

        // The search table is usually the table with class "c"
        const tables = document.querySelectorAll('table.c');
        if (tables.length === 0) return;
        
        const mainTable = tables[0];
        const rows = Array.from(mainTable.querySelectorAll('tr')).slice(1); // skip header row

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 9) return;

            // Columns typically: 0:ID, 1:Author, 2:Title, 3:Publisher, 4:Year, 5:Pages, 6:Language, 7:Size, 8:Extension
            const title = cells[2].innerText.toLowerCase();
            const lang = cells[6].innerText.toLowerCase();
            const ext = cells[8].innerText.toLowerCase();

            let show = true;
            if (titleFilter && !title.includes(titleFilter)) show = false;
            if (langFilter && !lang.includes(langFilter)) show = false;
            if (extFilter && !ext.includes(extFilter)) show = false;

            row.style.display = show ? '' : 'none';
        });
    }

    titleInput.addEventListener('input', applyFilters);
    langInput.addEventListener('input', applyFilters);
    extInput.addEventListener('input', applyFilters);
})();
