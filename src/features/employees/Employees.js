import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createEmployees, fetchEmployees, selectAllEmployees } from './employeesSlice'
import './employees.scss'

const Employees = () => {
    const dispatch = useDispatch()
    const employees = useSelector(selectAllEmployees)
    const employeesStatus = useSelector(state => state.employees.status)
    const [newEmployees, setNewEmployees] = useState([])

    useEffect(() => {
        if (employeesStatus === 'idle') {
            dispatch(fetchEmployees())
        }
    }, [employeesStatus, dispatch])

    const editEmployees = callback => {
        let updatedNewEmployees = newEmployees.slice()
        callback(updatedNewEmployees)
        setNewEmployees(updatedNewEmployees)
    }

    const handleChange = ({ target }, index) => {
        const { name, value } = target
        editEmployees(list => list[index][name] = value)
    }

    const handleStatusChange = ({ target }, index) => {
        const { name, checked } = target
        editEmployees(list => list[index].statuses[name] = checked)
    }

    const handleSalaryChange = ({ target }, index, salaryIndex) => {
        const { name, value } = target
        editEmployees(list => list[index].salaries[salaryIndex][name] = value)
    }

    const handleAddSalaryClick = index => {
        editEmployees(list => list[index].salaries.push({
            date: '',
            value: '',
        }))
    }

    const handleAddClick = () => {
        editEmployees(list => list.push({
            name: '',
            position: '',
            statuses: {
                resident: false,
                pensioner: false,
                disabled: false,
            },
            salaries: [
                {
                    date: '',
                    value: '',
                }
            ]
        }))
    }

    const handleCopyClick = employee => {
        let clone = Object.assign({}, employee)
        delete clone.id
        editEmployees(list => list.push(clone))
    }

    const handleSaveClick = async event => {
        event.preventDefault()
        dispatch(createEmployees(newEmployees))
        setNewEmployees([])
    }

    const copyButton = employee => <button type='button' onClick={() => handleCopyClick(employee)}>Copy</button>
    const addSalaryButton = index => <button type='button' onClick={() => handleAddSalaryClick(index)}>New salary</button>
    const addButton = <button type='button' onClick={handleAddClick}>Add</button>
    const saveButton = <button type='submit' onClick={handleSaveClick}>Save</button>

    if (employeesStatus !== 'succeeded') return 'LOADING'

    const renderedEmployees = employees.map((employee, index) =>
        <tr key={index}>
            <td>{employee.name}</td>
            <td>{employee.position}</td>
            <td>
                {Object.entries(employee.statuses)
                        .map(([status, value]) => value && <div key={status}>{status}</div>)
                }
            </td>
            <td>
                {employee.salaries
                        .map(({ date, value }) => <div key={date}>{date} - {value}</div>)
                }
            </td>
            <td className='button'>{copyButton(employee)}</td>
        </tr>
    )

    const renderedNewEmployees = newEmployees.map((employee, index) =>
        <tr key={index}>
            <td>
                <input
                    type='text'
                    required
                    id={`name-${index}`}
                    name='name'
                    placeholder='Enter a name'
                    value={employee.name}
                    onChange={event => handleChange(event, index)}
                />
            </td>
            <td>
                <input
                    required
                    type='text'
                    id={`position-${index}`}
                    name='position'
                    placeholder='Enter a position'
                    value={employee.position} 
                    onChange={event => handleChange(event, index)}
                />
            </td>
            <td className='statuses'>
                {Object.entries(employee.statuses).map(([status, value]) =>
                <div key={status}>
                    <input
                        type='checkbox'
                        id={`${status}-${index}`}
                        name={status} 
                        checked={value}
                        onChange={event => handleStatusChange(event, index)}
                    />
                    <label htmlFor={`${status}-${index}`}>{status}</label>
                </div>
                )}
            </td>
            <td className='salaries'>
                {employee.salaries.map(({ date, value }, salaryIndex) =>
                <div key={salaryIndex}>
                    <input
                        required
                        type='text'
                        id={`salary-${index}-${date}-date`}
                        name='date'
                        placeholder='dd.mm.yyyy'
                        value={date}
                        onChange={event => handleSalaryChange(event, index, salaryIndex)}
                    />
                    <input
                        required
                        type='text'
                        id={`salary-${index}-${date}-value`}
                        name='value'
                        placeholder='Enter a value'
                        value={value}
                        onChange={event => handleSalaryChange(event, index, salaryIndex)}
                    />
                </div>
                )}
                <div>{addSalaryButton(index)}</div>
            </td>
            <td className='button'>{copyButton(employee)}</td>
        </tr>
    )

    return (
        <form onSubmit={handleSaveClick}>
            <table className='employees'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Statuses</th>
                        <th>Salaries</th>
                    </tr>
                </thead>
                <tbody>
                    {renderedEmployees}
                    {renderedNewEmployees}
                    <tr>
                        <td className='button'>
                            {addButton}
                            {saveButton}
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}

export default Employees
