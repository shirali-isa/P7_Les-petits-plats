const sectionRecipes = document.getElementById('section-recipe');
const { recipes } = await getRecipes();

async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    return dataRecipes;
}

const text = {
    ingredients: 'Ingredients',
    appareils: 'Appareils',
    ustensils: 'Ustensiles'
}

let selectedTagIngredients = []
let selectedTagAppliances = []
let selectedTagUstensils = []

function recipesFactory(data) {
    const { name, time, ingredients, description } = data
    let liste = ''
    for (let i = 0; i < ingredients.length; i++) {
        liste = liste + `${ingredients[i].ingredient}:${ingredients[i].quantity || ''}${ingredients[i].unit || ''} <br>`
    }

    function getUserCardDom() {
        let code = `
        <div class="card">
            <div class="image" ></div>
            <div class="content">
                <div class="name-time">
                    <p class="name">${name}</p>
                    <div class="time" >
                         <i class="fa-regular fa-clock"></i>
                         <p class="minute">${time}min</p>
                    </div>
                </div>
                <div class="text" >
                    <p class="detail">${liste}</p>
                    <p class="description">${description}</p>
                </div>
            </div>
        </div>
        `
        sectionRecipes.innerHTML += code;
    }
    return { getUserCardDom }
}


// barre de recherche 

let inputSearch = document.querySelector('input');
inputSearch.addEventListener('input', () => { updateUI(recipes) })

function displayRecipes(recipes) {
    sectionRecipes.innerHTML = ''
    recipes.forEach(recipe => {
        const factoryRecipes = recipesFactory(recipe)
        factoryRecipes.getUserCardDom();
    });
}
// ///////////////////////////////////////////////////////////

function updateUI(recipes = recipes) {
    let filteredRecipes = filterSearch(recipes)
    displayRecipes(filteredRecipes)
    return filteredRecipes
}

function filterSearch(recipes) {
    selectedTagIngredients = Array.from(document.querySelectorAll('.tagIngredients'))
    selectedTagIngredients = selectedTagIngredients.map(t => { return t.innerText })
    selectedTagAppliances = Array.from(document.querySelectorAll('.tagAppareils'))
    selectedTagAppliances = selectedTagAppliances.map(t => { return t.innerText })
    selectedTagUstensils = Array.from(document.querySelectorAll('.tagUstensiles'))
    selectedTagUstensils = selectedTagUstensils.map(t => { return t.innerText })
    
    let query = {
        text: document.querySelector('.input-search').value,
        ingredients: selectedTagIngredients,
        appliances: selectedTagAppliances,
        ustensils: selectedTagUstensils
    }

    let filteredData = recipes.filter((recipe) => {
        if((recipe.name.includes(query.text) ||
            recipe.description.includes(query.text) ||
            recipe.ingredients.includes(query.text))
          && (query.ingredients.every(i => 
         recipe.ingredients.map(ingre => ingre.ingredient).includes(i)
          )) 
          && (query.appliances.every(i => recipe.appliance.includes(i)))
          && (query.ustensils.every(i => recipe.ustensils.map(ustensil => ustensil).includes(i)))
    
        ) {
            return true
        }
    })
    return filteredData;
}

updateUI(recipes)

//   section 3 type 
const filterIngredients = document.querySelector('.filterClassIngredients');
const filterAppliances = document.querySelector('.filterClassAppliances');
const filterUstensils = document.querySelector('.filterClassUstensils ');

filterIngredients.addEventListener('click', filterClick);
filterAppliances.addEventListener('click', filterClick);
filterUstensils.addEventListener('click', filterClick);

function filterClick(e) {
    const filtered = updateUI(recipes);
    const getRecipeIngredient = getIngredient(filtered);
    const getRecipeAppliance = getAppliance(filtered);
    const getRecipeUstensils = getUstensils(filtered);

    if(e.target.tagName === 'INPUT'){  // on selectionnee 'input' par defaut avec ' e.target.closest('.filterClass.....'). cest pour eviter de cela
        return 
    }

    if (e.target.closest('.filterClassIngredients')) {
        displayFilterClick(getRecipeIngredient, filterIngredients, text.ingredients);
        hideListe(filterUstensils, text.ustensils);
        hideListe(filterAppliances, text.appareils);
    }
    if (e.target.closest('.filterClassAppliances')) {
        displayFilterClick(getRecipeAppliance, filterAppliances, text.appareils);
        hideListe(filterUstensils, text.ustensils);
        hideListe(filterIngredients, text.ingredients)
    }
    if (e.target.closest('.filterClassUstensils')) {
        displayFilterClick(getRecipeUstensils, filterUstensils, text.ustensils)
        hideListe(filterAppliances, text.appareils);
        hideListe(filterIngredients, text.ingredients);
    }
}

// display //////////////////////

function displayFilterClick(listeByType, DOMFilterClick, nameOfElement) {
    const code = ` 
    <div class="bloc-allType">
        <input type="search" class="input-allType" placeholder="Rechercher un ${nameOfElement}">
        <i class="fa-solid fa-angle-up angleUp"></i>
    </div>
    <ul class="card-allType"></ul>
    `
    DOMFilterClick.innerHTML = code;
    DOMFilterClick.classList.replace('filter', 'filterClassAll');
    const searchType = DOMFilterClick.querySelector('.input-allType');

    listeByType.forEach(nameLi => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        const allBlocLi = document.createElement('li');
        allBlocLi.classList.add('allTypeLi');
        allBlocLi.innerText = nameLi;
        allBlocUl.appendChild(allBlocLi);

        allBlocLi.addEventListener('click', () => functionTag(DOMFilterClick,nameLi, nameOfElement))
    })

    searchType.addEventListener('change', () => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        allBlocUl.innerHTML = ''
        let filteredByType = listeByType.filter(label => {
            if (label.includes(searchType.value)) {
                return true
            }
        })

        filteredByType.forEach(nameLi => {
            const allBlocLi = document.createElement('li');
            allBlocLi.classList.add('allTypeLi');
            allBlocLi.innerText = nameLi;
            allBlocUl.appendChild(allBlocLi);
        })
    })
}

//  section tag 
const tag = document.querySelector('.tag');
let tagIngredientsBloc = document.querySelector('.tagIngredientsBloc ')
let tagAppliancesBloc = document.querySelector('.tagAppliancesBloc ')
let tagUstensilsBloc = document.querySelector('.tagUstensilsBloc ')

function functionTag(DOMFilterClick,nameLi, nameOfElement) {
    const code = `
    <div class="${nameOfElement} tag${nameOfElement}">
        <p>${nameLi}</p>
        <i class="fa-regular fa-circle-xmark closeTag"></i>
    </div>
    `   

    if(selectedTagIngredients.includes(nameLi) == false && DOMFilterClick.className === 'filterClassAll filterClassIngredients'){
        tagIngredientsBloc.innerHTML += code;
        selectedTagIngredients.push(nameLi)
    }
    if(selectedTagAppliances.includes(nameLi) == false && DOMFilterClick.className === 'filterClassAll filterClassAppliances'){
        tagAppliancesBloc.innerHTML += code;
        selectedTagAppliances.push(nameLi)        
    }
    if(selectedTagUstensils.includes(nameLi) == false && DOMFilterClick.className === 'filterClassAll filterClassUstensils'){
        tagUstensilsBloc.innerHTML += code;
        selectedTagUstensils.push(nameLi)
        // consogggggle.log(selectedTagUstensils);
    }

    const closeTag = document.querySelectorAll('.closeTag');
    for (let i = 0; i < closeTag.length; i++) {
        let textTag
        closeTag[i].addEventListener('click', (e) => {
            textTag = e.target.closest('div').innerText;
            if(selectedTagIngredients.includes(textTag)){
                e.target.closest('.tagIngredients').remove()
                updateUI(recipes)
            }
            if(selectedTagAppliances.includes(textTag)){
                e.target.closest('.tagAppareils').remove()
                updateUI(recipes)
            }
            if(selectedTagUstensils.includes(textTag)){
                e.target.closest('.tagUstensiles').remove()
                updateUI(recipes)
            }
        });
    }
}

// supprimer les blocs   // hide three bloc
function hideListe(element, query) {
    element.classList.replace('filterClassAll', 'filter');
    const code = `
    <p class="textButton">${query}</p>
    <i class="fa-solid fa-angle-down angleDown"></i>
    `
    element.innerHTML = code
}

// recuperer liste des trois elements 
// ingredient 
function getIngredient(recipes) {
    let arrayIngredientBeforeSet = []
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredientElement => {
            arrayIngredientBeforeSet.push(ingredientElement.ingredient)
        })
    })
    let objectNameIngredient = new Set(arrayIngredientBeforeSet);//creer nouveau tableau without doublont
    const arrayIngredientAfterSet = Array.from(objectNameIngredient)

    return arrayIngredientAfterSet
}

// appliance

function getAppliance(recipess) {
    let arrayApplianceBeforeSet = []
    recipess.forEach(recipe => {
        arrayApplianceBeforeSet.push(recipe.appliance)
    })
    let objectNameAppliance = new Set(arrayApplianceBeforeSet);
    const arrayApplianceAfterSet = Array.from(objectNameAppliance)
    return arrayApplianceAfterSet
}

// ustensils 

function getUstensils(recipess) {
    let arrayUstensilsBeforeSet = []
    recipess.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            arrayUstensilsBeforeSet.push(ustensil)
        })
    })
    let objectNameUstensils = new Set(arrayUstensilsBeforeSet)
    const arrayUstensilsAfterSet = Array.from(objectNameUstensils)
    return arrayUstensilsAfterSet
}


