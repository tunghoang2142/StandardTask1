/* Language section */
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import ProfileTable from './ProfileTable.jsx';
import { Select, Input } from 'semantic-ui-react';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.languageData ? props.languageData : []
        }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleAdd(data, callback = (bool = false) => { }) {
        var newData = [... this.state.data, data]
        this.props.saveProfileData(this.props.componentId, newData, (bool, _) => {
            callback(bool)
            if (bool) {
                // Refresh page to get new added language id
                this.props.fetchData()
                // this.setState({ data: newData })
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
        const levelOptions = [
            {
                key: 0,
                text: 'Basic',
                value: 'Basic'
            },
            {
                key: 1,
                text: 'Conversational',
                value: 'Conversational'
            },
            {
                key: 2,
                text: 'Fluent',
                value: 'Fluent'
            },
            {
                key: 3,
                text: 'Native/Bilingual',
                value: 'Native/Bilingual'
            }
        ]

        var displayData = this.state.data.map(data => { return { id: data.id, name: data.name, level: data.level } })

        return (
            <ProfileTable
                data={displayData}
                columns={["Language", "Level"]}
                handleAdd={this.handleAdd}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
                defaultBtnProps={{ secondary: true, content: 'Add' }}
                editBtnProps={{ basic: true, color: 'blue', content: 'Update' }}
                editCloseBtnProps={{ basic: true, color: 'red' }}
                form={(props) => {
                    const { UpdateButton, CloseButton, handleUpdate, handleClose, data = { name: "", level: "" } } = props
                    const [name, setName] = useState(data.name)
                    const [level, setLevel] = useState(data.level)
                    const [btnDisabled, setBtnDisabled] = useState(false)
                    return (
                        <React.Fragment>
                            <Input
                                placeholder='Add Language' className='profile-table-full-spacing' defaultValue={name}
                                onChange={(_, data) => {
                                    setName(data.value)
                                }}
                            />
                            <Select
                                className='profile-table-half-spacing' placeholder='Language Level'
                                defaultValue={level} options={levelOptions}
                                onChange={(_, data) => {
                                    setLevel(data.value)
                                }}
                            />
                            <UpdateButton disabled={btnDisabled} onClick={(e) => {
                                e.preventDefault(); setBtnDisabled(true);
                                var newData = Object.assign(Object.assign({}, data), { name: name, level: level })
                                handleUpdate(newData);
                            }} />
                            <CloseButton onClick={handleClose}>Close</CloseButton>
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}