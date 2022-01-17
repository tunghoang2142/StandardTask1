/* Experience section */
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import ProfileTable from './ProfileTable.jsx';
import { Container, Grid, Input } from 'semantic-ui-react';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.experienceData ? props.experienceData : []
        }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    };

    handleAdd(data, callback = (bool = false) => { }) {
        var newData = [... this.state.data, data]
        this.props.saveProfileData(this.props.componentId, newData, (bool, _) => {
            callback(bool)
            if (bool) {
                this.props.fetchData()
            }
        })
    }

    handleEdit(data, callback = (bool = false) => { }) {
        var newData = this.state.data.map(e => { return Object.assign({}, e) })
        newData.forEach(e => {
            if (e.id === data.id) {
                e = Object.assign(e, data)
            }
        });

        this.props.saveProfileData(this.props.componentId, newData, (bool, _) => {
            callback(bool)
            if (bool) {
                this.setState({ data: newData })
            }
        })
    }

    handleDelete(id) {
        var newData = this.state.data.filter(e => e.id != id)
        this.props.saveProfileData(this.props.componentId, newData, (bool, _) => {
            if (bool) {
                this.setState({ data: newData })
            }
        })
    }

    render() {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        //#Source https://bit.ly/2neWfJ2 
        const toOrdinalSuffix = num => {
            const int = parseInt(num),
                digits = [int % 10, int % 100],
                ordinals = ['st', 'nd', 'rd', 'th'],
                oPattern = [1, 2, 3, 4],
                tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
            return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
                ? int + ordinals[digits[0] - 1]
                : int + ordinals[3];
        }

        const toDisplayDate = dbDate => {
            const dateObj = new Date(dbDate)
            const day = toOrdinalSuffix(dateObj.getDate())
            const month = dateObj.toLocaleString('default', { month: 'short' })
            const year = dateObj.getFullYear()
            return `${day} ${month}, ${year}`
        }

        const toFormDate = displayDate => {
            var date = displayDate.split(" ")
            var day = date[0].slice(0, -2)
            var month = (months.indexOf(date[1].slice(0, -1))).toString()
            var year = date[2]
            date = new Date(year, month, day)
            return date.toLocaleString('en-GB', { day: 'numeric', month: '2-digit', year: 'numeric' })
        }

        const toDatabaseDate = formDate => {
            var date = formDate.split("/")
            return new Date(new Date(date[2], date[1] - 1, date[0]).toUTCString()).toISOString()
        }

        var displayData = this.state.data.map(data => {
            return {
                id: data.id, company: data.company, position: data.position, responsibilities: data.responsibilities,
                start: toDisplayDate(data.start), end: toDisplayDate(data.end)
            }
        })
        const today = toDisplayDate(new Date().toISOString())
        return (
            <ProfileTable
                data={displayData}
                columns={["Company", "Position", "Responsibilities", "Start", "End"]}
                handleAdd={this.handleAdd}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
                defaultBtnProps={{ secondary: true, content: 'Add' }}
                editBtnProps={{ secondary: true, content: 'Update' }}
                form={(props) => {
                    const { UpdateButton, CloseButton, handleUpdate, handleClose,
                        data = { company: "", position: "", responsibilities: "", start: today, end: today } } = props
                    const [company, setCompany] = useState(data.company)
                    const [position, setPosition] = useState(data.position)
                    const [responsibilities, setResponsibilities] = useState(data.responsibilities)
                    const [start, setStart] = useState(toFormDate(data.start))
                    const [end, setEnd] = useState(toFormDate(data.end))
                    const [btnDisabled, setBtnDisabled] = useState(false)

                    return (
                        <Grid padded columns={2} stretched>
                            <Grid.Row className='profile-grid'>
                                <Grid.Column className='profile-grid'>
                                    <p className='profile-label'>Company:</p>
                                    <Input
                                        placeholder='Company' className='profile-table-full-spacing' defaultValue={company}
                                        onChange={(_, data) => {
                                            setCompany(data.value)
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column className='profile-grid'>
                                    <p className='profile-label'>Position:</p>
                                    <Input
                                        placeholder='Position' defaultValue={position}
                                        onChange={(_, data) => {
                                            setPosition(data.value)
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className='profile-grid'>
                                <Grid.Column className='profile-grid'>
                                    <p className='profile-label'>Start Date:</p>
                                    <Input className='profile-table-full-spacing' defaultValue={start}
                                        onChange={(_, data) => {
                                            setStart(data.value)
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column className='profile-grid'>
                                    <p className='profile-label'>End Date:</p>
                                    <Input defaultValue={end}
                                        onChange={(_, data) => {
                                            setEnd(data.value)
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={1}>
                                <p className='profile-label'>Responsibilities:</p>
                                <Input
                                    placeholder='Responsibilities' defaultValue={responsibilities}
                                    onChange={(_, data) => {
                                        setResponsibilities(data.value)
                                    }}
                                />
                            </Grid.Row>
                            <UpdateButton disabled={btnDisabled} onClick={(e) => {
                                e.preventDefault(); setBtnDisabled(true);
                                var newData = Object.assign(Object.assign({}, data),
                                    {
                                        company: company, position: position, responsibilities: responsibilities,
                                        start: toDatabaseDate(start), end: toDatabaseDate(end)
                                    })
                                handleUpdate(newData);
                            }} />
                            <CloseButton onClick={handleClose}>Close</CloseButton>
                        </Grid>
                    )
                }}
            />
        )
    }
}
