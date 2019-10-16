import React, { Component } from "react";
import { graphql } from "react-apollo";
import fetchSong from "../queries/fetchSong";
import { Link } from "react-router";

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;
    if (!song) return <div></div>;

    return (
      <div>
        <Link to="/">Back</Link>
        <div>{song.title}</div>
      </div>
    );
  }
}

export default graphql(fetchSong, {
  // This props belongs to graphql layer
  // It can see props passed down from React router
  // /:id is props.params.id
  options: props => {
    return { variables: { id: props.params.id } };
  }
})(SongDetail);
