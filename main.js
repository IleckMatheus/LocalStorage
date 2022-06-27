'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_anime')) ?? []
const setLocalStorage = (dbAnime) => localStorage.setItem("db_anime", JSON.stringify(dbAnime))

// CRUD - create read update delete
const deleteAnime = (index) => {
    const dbAnime = readAnime()
    dbAnime.splice(index, 1)
    setLocalStorage(dbAnime)
}

const updateAnime = (index, anime) => {
    const dbAnime = readAnime()
    dbAnime[index] = anime
    setLocalStorage(dbAnime)
}

const readAnime = () => getLocalStorage()

const createAnime = (anime) => {
    const dbAnime = getLocalStorage()
    dbAnime.push (anime)
    setLocalStorage(dbAnime)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveAnime = () => {
    debugger
    if (isValidFields()) {
        const anime = {
            nome: document.getElementById('nome').value,
            ano: document.getElementById('ano').value,
            genero: document.getElementById('genero').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createAnime(anime)
            updateTable()
            closeModal()
        } else {
            updateAnime(index, anime)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (anime, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${anime.nome}</td>
        <td>${anime.ano}</td>
        <td>${anime.genero}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableAnime>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableAnime>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readAnime()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (anime) => {
    document.getElementById('nome').value = anime.nome
    document.getElementById('ano').value = anime.ano
    document.getElementById('genero').value = anime.genero
    document.getElementById('nome').dataset.index = anime.index
}

const editAnime = (index) => {
    const anime = readAnime()[index]
    anime.index = index
    fillFields(anime)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editAnime(index)
        } else {
            const anime = readAnime()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${anime.nome}`)
            if (response) {
                deleteAnime(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarAnime')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveAnime)

document.querySelector('#tableAnime>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)