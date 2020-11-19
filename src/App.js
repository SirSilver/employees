import React from 'react'
import Employees from './features/employees/Employees'
import { createServer } from 'miragejs'

const initialData = [
    {
        name: 'name1',
        position: 'position1',
        statuses: {
            resident: true,
            pensioner: false,
            disabled: false,
        },
        salaries: [
            {
                date: '10.10.2010',
                value: 85000,
            },
            {
                date: '15.05.2015',
                value: 130000,
            },
            {
                date: '01.01.2020',
                value: 180000,
            },
        ]
    },
    {
        name: 'name2',
        position: 'position2',
        statuses: {
            resident: true,
            pensioner: true,
            disabled: false,
        },
        salaries: [
            {
                date: '10.10.2010',
                value: 85000,
            },
            {
                date: '15.05.2015',
                value: 130000,
            },
            {
                date: '01.01.2020',
                value: 180000,
            }
        ]
    }
]

createServer({
    seeds(server) {
        server.db.loadData({
            employees: initialData
        })
    },
    routes() {
        this.namespace = 'api'

        this.get('/employees', (schema) => {
            return schema.db.employees
        })
        this.post('/add_employees', (schema, request) => {
            let attrs = JSON.parse(request.requestBody)
            return schema.db.employees.insert(attrs)
        })
    },
})


const App = () => {
  return (
      <Employees />
  )
}

export default App;
