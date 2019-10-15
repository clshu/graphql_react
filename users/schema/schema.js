const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
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
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/users`)
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
        },
        companies: {
            type: new GraphQLList(CompanyType),
            async resolve(parent, args) {
                resp = await axios.get(`http://localhost:3000/companies`)
                return resp.data
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args:  {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId:  { type: GraphQLString }  
            },
            async resolve(parent, { firstName, age }) {
                resp = await axios.post('http://localhost:3000/users', { firstName, age })
                return resp.data
            }
        },
        deleteUser: {
            type: UserType,
            args:  {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, { id }) {
                resp = await axios.delete(`http://localhost:3000/users/${id}`)
                return resp.data
            }
        },
        editUser: {
            type: UserType,
            args:  {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId:  { type: GraphQLString }  
            },
            async resolve(parent, args) {
                resp = await axios.patch(`http://localhost:3000/users/${args.id}`, args)
                return resp.data
            }
        },
    }
})

module.exports = new GraphQLSchema({
    mutation,
    query: RootQuery
})

