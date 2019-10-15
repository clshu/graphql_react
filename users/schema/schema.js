const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/companies/${parent.id}/users`)
                return resp.data
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/companies/${parent.companyId}`)
                return resp.data
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/users/${args.id}`)
                return resp.data
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/companies/${args.id}`)
                return resp.data
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})

