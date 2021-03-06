const React = require('react');
const PropTypes = require('prop-types');

class SwitchButton extends React.Component {

    static propTypes = {
        checked: PropTypes.bool,
        onSwitch: PropTypes.func
    };

    static defaultProps = {
        checked: false,
        onSwitch: () => {}
    };

    componentWillMount() {
        this.setState({
            checked: this.props.checked
        });
    }

    render() {
        return (<label className="mapstore-switch-btn">
            <input type="checkbox"
                onChange={() => {
                    this.props.onSwitch(!this.state.checked);
                    this.setState({
                        checked: !this.state.checked
                    });
                }}
                checked={this.state.checked}
                />
            <span className="m-slider"/>
        </label>);
    }
}

module.exports = SwitchButton;
