import * as React from "react"
import { Link } from "gatsby"


// markup
const NotFoundPage = () => {
  return (
    <main>
      <title>Not found</title>
      <h1>Page not found</h1>
      <p>
        Sorry! You're trying to access some of my private files, pages I haven't finished writing/updating, or I've made a mistake in my webdev. 
        <Link to="/">Go home</Link>.
      </p>
    </main>
  )
}

export default NotFoundPage
