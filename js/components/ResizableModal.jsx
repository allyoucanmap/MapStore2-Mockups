/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {Glyphicon} = require('react-bootstrap');
const Dialog = require('../../MapStore2/web/client/components/misc/Dialog');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');

const sizes = {
    sm: ' ms-sm',
    md: '',
    lg: ' ms-lg'
};

const fullscreen = {
    className: {
        vertical: ' ms-fullscreen-v',
        horizontal: ' ms-fullscreen-h',
        full: ' ms-fullscreen'
    },
    glyph: {
        expanded: {
            vertical: 'resize-vertical',
            horizontal: 'resize-horizontal',
            full: 'resize-small'
        },
        collapsed: {
            vertical: 'resize-vertical',
            horizontal: 'resize-horizontal',
            full: 'resize-full'
        }
    }
};

class ResizableModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool,
        fullscreen: PropTypes.bool,
        fullscreenType: PropTypes.string,
        onClose: PropTypes.func,
        title: PropTypes.node,
        buttons: PropTypes.array,
        size: PropTypes.string,
        bodyClassName: PropTypes.string
    };

    static defaultProps = {
        show: false,
        onClose: null,
        title: '',
        fullscreen: false,
        fullscreenType: 'full',
        buttons: [],
        size: '',
        bodyClassName: ''
    };

    state = {
        fullscreen: 'collapsed'
    };

    render() {
        const sizeClassName = sizes[this.props.size] || '';
        const fullscreeClassName = this.props.fullscreen && this.state.fullscreen === 'expanded' && fullscreen.className[this.props.fullscreenType] || '';
        return (
            <Dialog
                id="ms-resizable-modal"
                style={{display: this.props.show ? 'flex' : 'none'}}
                onClickOut={this.props.onClose}
                containerClassName="ms-resizable-modal"
                draggable={false}
                modal
                className={'modal-dialog modal-content' + sizeClassName + fullscreeClassName}>
                <span role="header">
                    <h4 className="modal-title">
                        <div className="ms-title">{this.props.title}</div>
                        {this.props.fullscreen && fullscreen.className[this.props.fullscreenType] &&
                            <Glyphicon
                                className="ms-header-btn"
                                onClick={() => {
                                    this.setState({
                                        fullscreen: this.state.fullscreen === 'expanded' ? 'collapsed' : 'expanded'
                                    });
                                }}
                                glyph={fullscreen.glyph[this.state.fullscreen][this.props.fullscreenType]}/>
                        }
                        {this.props.onClose &&
                            <Glyphicon
                                glyph="1-close"
                                className="ms-header-btn"
                                onClick={this.props.onClose}/>
                        }
                    </h4>
                </span>
                <div role="body" className={this.props.bodyClassName}>
                    {this.props.children}
                </div>
                <div role="footer">
                    <Toolbar buttons={this.props.buttons}/>
                </div>
            </Dialog>
        );
    }
}

module.exports = ResizableModal;
