// Global variables to store loaded data
let villageData = null;
let names = null;
let heroImages = null;

// Load JSON data files
async function loadData() {
    try {
        const [villageResponse, namesResponse, heroImagesResponse] = await Promise.all([
            fetch('Data/village-data.json'),
            fetch('Data/names.json'),
            fetch('Data/hero-images.json')
        ]);

        if (!villageResponse.ok || !namesResponse.ok || !heroImagesResponse.ok) {
            throw new Error('Failed to load data files');
        }

        villageData = await villageResponse.json();
        names = await namesResponse.json();
        heroImages = await heroImagesResponse.json();

        // Initialize page after data is loaded
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
        document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;"><h1>Error loading data</h1><p>Please check that all data files are available.</p></div>';
    }
}

// Name nikalne helper function
function getName(id) {
    return names[id] || `Unknown (${id})`;
}

// Time format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
}

// Page load huda run hunxa
function initializePage() {
    // Player tag set
    document.getElementById('playerTag').textContent = villageData.tag;
    
    // Town Hall level nikalne ra display garne
    const townHall = villageData.buildings.find(b => b.data === 1000001);
    const townHallElement = document.getElementById('townhallLevel');
    const townHallImg = heroImages['1000001'] || '';
    
    let townHallHTML = `<div class="townhall-text">Town Hall Level ${townHall.lvl}</div>`;
    if (townHallImg) {
        townHallHTML += `<img src="${townHallImg}" alt="Town Hall" class="townhall-image">`;
    }
    townHallElement.innerHTML = townHallHTML;
    
    // Heroes render garne
    renderHeroes();
}

// Heroes display garne function
function renderHeroes() {
    const heroesGrid = document.getElementById('heroesGrid');
    heroesGrid.innerHTML = ''; // Pehile khali garne
    
    villageData.heroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        // Hero ko image add garne
        const heroImg = heroImages[hero.data] || '';
        
        let heroHTML = '';
        
        // Image add 
        if (heroImg) {
            heroHTML += `<img src="${heroImg}" alt="${getName(hero.data)}" class="hero-image" onerror="this.style.display='none'">`;
        }
        
        heroHTML += `
            <div class="hero-name">${getName(hero.data)}</div>
            <div class="hero-level">Level ${hero.lvl}</div>
        `;
        
        heroCard.innerHTML = heroHTML;
        heroesGrid.appendChild(heroCard);
    });
}

// Buildings display function
function renderBuildings() {
    const buildingsGrid = document.getElementById('buildingsGrid');
    buildingsGrid.innerHTML = '';
    
    villageData.buildings.forEach(building => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        let buildingHTML = `
            <div class="item-name">${getName(building.data)}</div>
            <div class="item-level">Level ${building.lvl}</div>
        `;
        
        // Count show multiple xa bhane
        if (building.cnt && building.cnt > 1) {
            buildingHTML += `<div class="item-count">Quantity: ${building.cnt}</div>`;
        }
        
        itemCard.innerHTML = buildingHTML;
        buildingsGrid.appendChild(itemCard);
    });
}

// Troops display function
function renderTroops() {
    const troopsGrid = document.getElementById('troopsGrid');
    troopsGrid.innerHTML = '';
    
    // Normal troops
    villageData.units.forEach(troop => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        let troopHTML = `
            <div class="item-name">${getName(troop.data)}</div>
            <div class="item-level">Level ${troop.lvl}</div>
        `;
        
        itemCard.innerHTML = troopHTML;
        troopsGrid.appendChild(itemCard);
    });
    
    // Siege machines
    villageData.siege_machines.forEach(siege => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        itemCard.innerHTML = `
            <div class="item-name">${getName(siege.data)}</div>
            <div class="item-level">Level ${siege.lvl}</div>
        `;
        
        troopsGrid.appendChild(itemCard);
    });
}

// Spells display function
function renderSpells() {
    const spellsGrid = document.getElementById('spellsGrid');
    spellsGrid.innerHTML = '';
    
    villageData.spells.forEach(spell => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        itemCard.innerHTML = `
            <div class="item-name">${getName(spell.data)}</div>
            <div class="item-level">Level ${spell.lvl}</div>
        `;
        
        spellsGrid.appendChild(itemCard);
    });
}

// Section toggle: show/hide
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    // Section banda xa bhane kholne and vice versa
    if (section.classList.contains('active')) {
        section.classList.remove('active');
    } else {
        // First sab sections banda garne
        document.querySelectorAll('.stats-section').forEach(s => {
            s.classList.remove('active');
        });
        
        // Selected section kholne
        section.classList.add('active');
        
        // Content render
        if (sectionId === 'buildings' && section.querySelector('.items-grid').children.length === 0) {
            renderBuildings();
        } else if (sectionId === 'troops' && section.querySelector('.items-grid').children.length === 0) {
            renderTroops();
        } else if (sectionId === 'spells' && section.querySelector('.items-grid').children.length === 0) {
            renderSpells();
        }
        
        // Section ma scroll garne
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Page load huda initialize garne
window.onload = loadData;

