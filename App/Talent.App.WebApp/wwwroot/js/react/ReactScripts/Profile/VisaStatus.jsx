import React from 'react'
import { Button, Container, Grid, Input, Select } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newData: {
                visaStatus: this.props.visaStatus,
                visaExpiryDate: this.props.visaExpiryDate ? this.props.visaExpiryDate : new Date().toISOString()
            },
            saveBtnDisabled: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    toFormDate(dbDate) {
        try {
            var date = new Date(dbDate)
            return date.toLocaleString('en-GB', { day: 'numeric', month: '2-digit', year: 'numeric' })
        } catch (_) {
            return dbDate
        }

    }

    toDatabaseDate(formDate) {
        try {
            var date = formDate.split("/")
            return new Date(new Date(date[2], date[1] - 1, date[0]).toUTCString()).toISOString()
        } catch (_) {
            return formDate
        }

    }

    handleSave() {
        this.setState({ saveBtnDisabled: true })
        const data = Object.assign({}, this.state.newData)
        this.props.saveProfileData(data, () => {
            this.setState({ saveBtnDisabled: false })
        })
    }

    handleChange(name, data) {
        var newData = Object.assign({}, this.state.newData)
        newData[name] = data
        this.setState({ newData: newData })
    }

    render() {
        const visaOption = [
            {
                key: 0,
                text: 'Citizen',
                value: 'Citizen'
            },
            {
                key: 1,
                text: 'Permanent Resident',
                value: 'Permanent Resident'
            },
            {
                key: 2,
                text: 'Work Visa',
                value: 'Work Visa'
            },
            {
                key: 3,
                text: 'Student Visa',
                value: 'Student Visa'
            }
        ]

        var showExpiry = [visaOption[2].value, visaOption[3].value].includes(this.state.newData.visaStatus)
        return (
            <Container className='profile-container'>
                <Grid padded columns={3}>
                    <Grid.Column className='profile-grid' stretched width={6}>
                        <p className='profile-label'>Visa type</p>
                        <Select className='profile-table-double-spacing'
                            name={'visaStatus'}
                            options={visaOption}
                            onChange={(_, data) => { this.handleChange(data.name, data.value) }}
                            defaultValue={this.state.newData.visaStatus}
                            placeholder='Select Visa'
                        />
                    </Grid.Column>
                    {showExpiry ? <Grid.Column className='profile-grid' stretched width={6}>
                        <p className='profile-label'>Visa expire date</p>
                        <Input
                            name={'visaExpiryDate'}
                            className='profile-table-double-spacing'
                            onChange={(_, data) => {
                                this.handleChange(data.name, this.toDatabaseDate(data.value))
                            }}
                            defaultValue={this.toFormDate(this.state.newData.visaExpiryDate)}
                        />
                    </Grid.Column> : null}
                    <Grid.Column className='profile-grid' width={2}>
                        <br />
                        <Button secondary disabled={this.state.saveBtnDisabled} onClick={this.handleSave}>Save</Button>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}