import React, { Component } from "react";
import { Link, hashHistory } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import fetchSongs from "../queries/fetchSongs";

class SongCreate extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "" };
  }

  onSubmit(event) {
    event.preventDefault();
    // Send mutation request to the server
    // add a new song
    this.props
      .mutate({
        variables: { title: this.state.title },
        refetchQueries: [{ query: fetchSongs }]
      })
      .then(() => hashHistory.push("/")); // go back "/"
  }
  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a new song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

// GraphiQL can run this too
const mutation = gql`
  mutation AddSong($title: String) {
    addSong(title: $title) {
      id
      title
    }
  }
`;

export default graphql(mutation)(SongCreate);
