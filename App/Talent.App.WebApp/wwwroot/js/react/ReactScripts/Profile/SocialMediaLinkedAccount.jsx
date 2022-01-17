/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup, Button, Icon, Container, Label } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openEdit: false,
            newData: this.props.linkedAccounts ? this.props.linkedAccounts : {
                linkedIn: "",
                github: ""
            },
            saveBtnDisabled: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.openEditView = this.openEditView.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEditView() {
        this.setState({
            newData: this.props.linkedAccounts ? this.props.linkedAccounts : {
                linkedIn: "",
                github: ""
            }
        }, () => {
            this.setState({ openEdit: true })
        })
    }

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
        this.props.saveProfileData(this.props.componentId, data, (bool, newData) => {
            if (bool) {
                this.setState({ openEdit: false, saveBtnDisabled: false })
            } else {
                this.setState({ saveBtnDisabled: false })
                // this.setState({
                //     errorForms: newData
                // })
            }
        })
    }

    render() {
        return this.state.openEdit ? this.renderEdit() : this.renderView()
        // return this.renderEdit()
    }

    renderView() {
        const { linkedIn, github } = this.props.linkedAccounts
        return (
            <Container className='profile-container'>
                <Button primary className='social-media' href={linkedIn}>
                    <Icon name='linkedin' />LinkedIn
                </Button>
                <Button secondary className='social-media' href={github}>
                    <Icon name='github' />GitHub
                </Button>
                <Button secondary floated='right' onClick={(e) => {
                    e.preventDefault()
                    this.openEditView()
                }}
                >Edit</Button>
            </Container>
        )
    }

    renderEdit() {
        const { newData } = this.state
        return (
            <Container className='profile-container'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={newData.linkedIn}
                    controlFunc={this.handleChange}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={newData.github}
                    controlFunc={this.handleChange}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid url"
                />
                <Button secondary disabled={this.state.saveBtnDisabled} onClick={(e) => {
                    this.handleSave()
                    e.preventDefault()
                }}>Save</Button>
                <Button onClick={() => { this.setState({ openEdit: false }) }}>Cancel</Button>
            </Container>
        )
    }

}