import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button, Container, Grid, GridColumn, GridRow, Input, Select } from 'semantic-ui-react';
import { countries } from '../Employer/common';

export class Address extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newData: {
                city: props.addressData.city ? props.addressData.city : "",
                country: props.addressData.country ? props.addressData.country : "",
                number: props.addressData.number ? props.addressData.number : "",
                postCode: props.addressData.postCode ? props.addressData.postCode : 0,
                street: props.addressData.street ? props.addressData.street : "",
                suburb: props.addressData.suburb ? props.addressData.suburb : ""
            },
            openEdit: false,
            saveBtnDisabled: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.openEditView = this.openEditView.bind(this)
    }

    openEditView() {
        this.setState({
            newData: {
                city: this.props.addressData.city ? this.props.addressData.city : "",
                country: this.props.addressData.country ? this.props.addressData.country : "",
                number: this.props.addressData.number ? this.props.addressData.number : "",
                postCode: this.props.addressData.postCode ? this.props.addressData.postCode : 0,
                street: this.props.addressData.street ? this.props.addressData.street : "",
                suburb: this.props.addressData.suburb ? this.props.addressData.suburb : ""
            }
        }, () => {
            this.setState({ openEdit: true })
        })
    }

    handleChange(_, data) {
        let newData = Object.assign(this.state.newData)
        newData[data.name] = data.value
        // Change city if country is not the same
        if (data.name == "country" && data.value != this.state.newData.country) {
            newData["city"] = countries[data.value][0]
        }
        this.setState({ newData: newData })
    }

    handleSave() {
        this.setState({ saveBtnDisabled: true })
        const data = Object.assign({}, this.state.newData)
        this.props.saveProfileData(this.props.componentId, data, (bool, _) => {
            if (bool) {
                this.setState({ openEdit: false, saveBtnDisabled: false })
            } else {
                this.setState({ saveBtnDisabled: false })
            }
        })
    }

    render() {
        return this.state.openEdit ? this.renderEdit() : this.renderView()
    }

    renderView() {
        let { number, street, suburb, country, city, postCode } = this.props.addressData
        let address = number ? number + ", " : ""
        address += street ? street + ", " : ""
        address += suburb ? suburb + ", " : ""
        address += postCode ? postCode : ""

        return (
            <Container className='profile-container'>
                <p className='description-text'>
                    Address: {address}
                </p>
                <p className='description-text'>
                    City: {city}
                </p>
                <p className='description-text'>
                    Country: {country}
                </p>
                <Button secondary floated='right' onClick={(e) => {
                    e.preventDefault()
                    this.openEditView()
                }}
                >Edit</Button>
            </Container>
        )
    }

    renderEdit() {
        const countries = Object.keys(Countries)
        const city = Countries[this.state.newData.country] ? Countries[this.state.newData.country] : []
        return (
            <Grid columns={3} className='address-grid'>
                <GridRow className='address-row'>
                    <GridColumn className='address-column' stretched width={4}>
                        <p className='address-label'>Number</p>
                        <Input name="number" value={this.state.newData.number} onChange={this.handleChange}></Input>
                    </GridColumn>
                    <GridColumn className='address-column' stretched width={8}>
                        <p className='address-label'>Street</p>
                        <Input name="street" value={this.state.newData.street} onChange={this.handleChange}></Input>
                    </GridColumn>
                    <GridColumn className='address-column' stretched width={4}>
                        <p className='address-label'>Suburb</p>
                        <Input name="suburb" value={this.state.newData.suburb} onChange={this.handleChange}></Input>
                    </GridColumn>
                </GridRow>
                <GridRow className='address-row'>
                    <GridColumn className='address-column' stretched width={6}>
                        <p className='address-label'>Country</p>
                        <Select
                            name="country"
                            options={countries.map((country) => {
                                return { key: country, value: country, text: country }
                            })}
                            onChange={this.handleChange}
                            value={this.state.newData.country}
                        />
                    </GridColumn>
                    <GridColumn className='address-column' stretched width={6}>
                        <p className='address-label'>City</p>
                        <Select
                            name="city"
                            options={city.map((city) => {
                                return { key: city, value: city, text: city }
                            })}
                            onChange={this.handleChange}
                            value={this.state.newData.city}
                        />
                    </GridColumn>
                    <GridColumn className='address-column' stretched width={4}>
                        <p className='address-label'>Post Code</p>
                        <Input name="postCode" value={this.state.newData.postCode} onChange={this.handleChange}></Input>
                    </GridColumn>
                </GridRow>
                <Button className='address-button' secondary disabled={this.state.saveBtnDisabled} onClick={(e) => {
                    this.handleSave()
                    e.preventDefault()
                }}>Save</Button>
                <Button onClick={(e) => { this.setState({ openEdit: false }); e.preventDefault() }}>Cancel</Button>
            </Grid>

        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nationality: props.nationalityData
        }
    }

    render() {
        const countries = Object.keys(Countries)
        return (
            <Container className='profile-container'>
                <Select
                    options={countries.map((country) => {
                        return { key: country, value: country, text: country }
                    })}
                    onChange={(_, data) => {
                        this.props.saveProfileData({
                            nationality: data.value
                        })
                    }}
                    defaultValue={this.props.nationalityData}
                    placeholder='Select your country'
                />
            </Container>
        )

    }
}