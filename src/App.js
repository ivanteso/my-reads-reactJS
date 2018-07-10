import React from 'react'
import { Link, Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp';
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

     query: '',
     searchResult: []
  }

  componentDidMount() {
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
        if (book.imageLinks === undefined) {
          book.imageLinks = {};
          book.imageLinks.thumbnail = 'https://inc.mizanstore.com/aassets/img/com_cart/produk/no_cover.jpg';
        }
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
    })
  }

  searchQuery = (query) => {
    const searchResult = []
    this.setState({ query })
    if (query.length === 0) {
      this.setState({ query, searchResult })
      return
    } else {
      BooksAPI.search(query.trim()).then(resp => {
        if (resp.error !== 'empty query') {
          resp.forEach(matchBook => {
            if (matchBook.imageLinks === undefined) {
              matchBook.imageLinks = {};
              matchBook.imageLinks.thumbnail = 'https://inc.mizanstore.com/aassets/img/com_cart/produk/no_cover.jpg';
            }
            searchResult.push(matchBook);
          })
        } else {
            console.log('No book found!')
        }
        this.setState({ searchResult })
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
                  shelfName='Currently Reading'/>
                <BooksList
                  shelf={this.state.wannaRead}
                  shelfName='Want To Read'/>
                <BooksList
                  shelf={this.state.read}
                  shelfName='read'/>
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
            onQuery={this.state.query}
            onSearch={this.searchQuery}
            />
        )} />

      </div>
    )
  }
}

export default BooksApp
