import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBook from './SearchBook'
import BooksList from './BooksList'

class BooksApp extends React.Component {
  state = {

    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */

     currentlyReading: [],
     wannaRead: [],
     read: [],
     allBooks: []
  }

  componentDidMount() {
    const currentlyReading = [];
    const wannaRead = [];
    const read = [];
    const allBooks = [];

    BooksAPI.getAll().then(books => {
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
      this.setState({ currentlyReading, wannaRead, read, allBooks })
    })
  }


  render() {
    return (

      <div className="app">

          <SearchBook />

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
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
            
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
      </div>
    )
  }
}

export default BooksApp
