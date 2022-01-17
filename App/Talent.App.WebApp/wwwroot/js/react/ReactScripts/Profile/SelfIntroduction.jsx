/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { Container, Input, TextArea, Button } from 'semantic-ui-react';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                summary: this.props.summary ? this.props.summary : "",
                description: this.props.description ? this.props.description : ""
            },
            saveBtnDisabled: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
    };

    handleChange(event) {
        const data = Object.assign({}, this.state.newData)
        data[event.target.name] = event.target.value
        this.setState({
            newData: data
        })
    }

    handleSave() {
        this.setState({ saveBtnDisabled: true })
        const data = Object.assign({}, this.state.newData)
        this.props.updateProfileData(data, (bool) => {
            if (bool) {
                this.props.updateWithoutSave(data)
                this.setState({ data: data, saveBtnDisabled: false })
            } else {
                this.setState({ saveBtnDisabled: false })
                console.error("Unable to save!")
            }
        })
    }

    render() {
        return (
            <Container className='profile-container'>
                <Input fluid className="field"
                    name="summary"
                    placeholder="Please provide a short summary about yourself"
                    defaultValue={this.state.data.summary}
                    onChange={this.handleChange}
                ></Input>
                <p className='description-text'>
                    Summary must be no more than 150 characters.
                </p>
                <TextArea className="field"
                    name="description"
                    placeholder="Please tell us about any hobbies, additional expertise, or anything else you would like to add."
                    defaultValue={this.state.data.description}
                    onChange={this.handleChange}
                ></TextArea>
                <p className='description-text'>
                    Description must be between 150-600 characters.
                </p>
                <Button secondary floated='right' onClick={this.handleSave} disabled={this.state.saveBtnDisabled}>Save</Button>
            </Container>
        )
    }
}



