import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBook from './SearchBook'
import BooksList from './BooksList'

class BooksApp extends React.Component {

  state = {
     // States used by BooksList
     currentlyReading: [],
     wannaRead: [],
     read: [],
     allBooks: [],

     // States used by search component
     query: '',
     searchResult: [],
     bookNotFound: []
  }

  getAllBooks() {
    // Empty arrays to fill after getAll is called from BooksAPI
    const currentlyReading = [];
    const wannaRead = [];
    const read = [];
    const allBooks = [];

    // Get all books
    BooksAPI.getAll().then(books => {
      // Loop over all books and push them into the right array
      // depending on their .shelf value
      books.forEach(book => {
        if (book.shelf === 'currentlyReading') {
          currentlyReading.push(book);
        } else if (book.shelf === 'wantToRead') {
          wannaRead.push(book);
        } else if (book.shelf === 'read') {
          read.push(book);
        }
        allBooks.push(book)
      })
      // set the arrays as new state
      this.setState({ currentlyReading, wannaRead, read, allBooks })
      // catch the error if BooksAPI fail to fetch books
    }).catch(err => {
      console.error('Warning, an error occurred trying to fetch books from BooksAPI', err);
    })
  }

  // Call function after component did mount
  componentDidMount() {
    this.getAllBooks()
  }

  // Update backend via API and then refresh the shelves via getAllBooks
  changeShelf = (book, updatedShelf) => {
    BooksAPI.update(book, updatedShelf)
    this.getAllBooks()
  }

  searchQuery = (query) => {
    // Empty book provided if the search doesn't match any book on database
    const emptyBook = {
      id: 0,
      imageLinks: {
        thumbnail: 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/magnifying_glass.png'
      },
      title: 'Book not found!'
    }

    this.setState({ query })
    // if the query is empty, setState di empty array and exit the function
    if (query.length === 0) {
      this.setState({ query, searchResult: [], bookNotFound: [] })
      return
    } else {
      BooksAPI.search(query.trim())
      .then(resp => {
        // If the response is not empty, start the function
        if (resp.error !== 'empty query') {
          // loop over the response and add a 'no cover' thumbnail image
          // to avoid errors trying to render it later
          resp.forEach(queryBook => {
            if (queryBook.imageLinks === undefined) {
              queryBook.imageLinks = {};
              queryBook.imageLinks.thumbnail = 'https://inc.mizanstore.com/aassets/img/com_cart/produk/no_cover.jpg';
            }
            // Like before, add an author in case the field is empty
            if (queryBook.authors === undefined) {
              queryBook.authors = ['Various authors'];
            }
          })
          // Compare the search result array with allBooks array and if two books
          // match each other, set the proper shelf into the response array
          resp = resp.map(searchedBook => {
            for (const book of this.state.allBooks) {
              if (searchedBook.id === book.id) {
                searchedBook.shelf = book.shelf
                break;
              } else {
                // if doesn't match any book, set shelf as 'none'
                searchedBook.shelf = 'none'
              }
            }
            return searchedBook
          })
          // set the searchResult state as the response array, so SearchBook can
          // render the elements on the page
          this.setState({ searchResult: resp})
        } else {
          // if the search result is empty, push emptyBook in bookNotFound
          // and setState + render
            this.setState({ bookNotFound: [emptyBook], searchResult: [] })
        }
      })
    }
	}


  render() {
    return (

      <div className="app">
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>

          <Route exact path='/' render={() => (
            <div className="list-books-content">
              <div>
                <BooksList
                  shelf={this.state.currentlyReading}
                  shelfName='Currently Reading'
                  onShelfSelector={this.changeShelf}
                  />
                <BooksList
                  shelf={this.state.wannaRead}
                  shelfName='Want To Read'
                  onShelfSelector={this.changeShelf}
                  />
                <BooksList
                  shelf={this.state.read}
                  shelfName='Read'
                  onShelfSelector={this.changeShelf}
                  />
              </div>
            </div>
          )} />

          <div className="open-search">
            <Link to='/search'>Add a book</Link>
          </div>
        </div>

        <Route exact path='/search' render={() => (
          <SearchBook
            bookFoundList={this.state.searchResult}
            emptyList={this.state.bookNotFound}
            onQuery={this.state.query}
            onSearch={this.searchQuery}
            onShelfSelector={this.changeShelf}
            />
        )} />

      </div>
    )
  }
}

export default BooksApp
