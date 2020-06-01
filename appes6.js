class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">&#10008;</a></td>
    `;
    list.appendChild(row);
    }
    clearField(){
        document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
    }
    showAlert(message, className){
        const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('form');
    container.insertBefore(div, form);
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
}

// local storage
class Store{
    static getBooks(){
        let books = localStorage.getItem('books') === null ? [] : JSON.parse(localStorage.getItem('books'));
        return books;
    }
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;
            ui.addBookToList(book);
        });
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book, index){
           if(book.isbn === isbn){
               books.splice(index, 1);
           }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// event DOM load
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// add event
document.querySelector('form').addEventListener('submit', function(event){
    
    // value
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // instantiate input
    const book = new Book(title, author, isbn);

    // instantiate ui
    const ui = new UI();

    // validate
    if(title === '' || author === '' || isbn === ''){
        // error alert
        ui.showAlert('Please fill in all field', 'error');
    }else{
        // addBookToList prototype
        ui.addBookToList(book);
        // add local storage
        Store.addBook(book);
        // success alert
        ui.showAlert('Book Added', 'success');
        // clear field
        ui.clearField();
    }

    // prevent default behaviour
    event.preventDefault();
});

// delete event
document.getElementById('tbody').addEventListener('click', function(event){

    // instantiate ui
    const ui = new UI();

    // delete book call
    ui.deleteBook(event.target);

    // remove from local storages
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);

    // show alert
    ui.showAlert('Book Removed', 'success');

    event.preventDefault();
});