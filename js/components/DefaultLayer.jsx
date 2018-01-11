/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Node = require('../../MapStore2/web/client/components/TOC/Node');
const {isObject, isArray} = require('lodash');
const {ProgressBar, Grid, Row, Col, Button, Glyphicon, Tooltip, OverlayTrigger} = require('react-bootstrap');
const VisibilityCheck = require('../../MapStore2/web/client/components/TOC/fragments/VisibilityCheck');
const Title = require('../../MapStore2/web/client/components/TOC/fragments/Title');
// const WMSLegend = require('../../MapStore2/web/client/components/TOC/fragments/WMSLegend');
const LayersTool = require('../../MapStore2/web/client/components/TOC/fragments/LayersTool');
const Slider = require('react-nouislider');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const ButtonT = tooltip(Button);

const timeValue = [
    {
        label: '5 s',
        value: 5
    },
    {
        label: '15 s',
        value: 15
    },
    {
        label: '30 s',
        value: 30
    },
    {
        label: '1 m',
        value: 60
    },
    {
        label: '5 m',
        value: 300
    },
    {
        label: '10 m',
        value: 600
    }
];

class SquareIcon extends React.Component {
    static propTypes = {
        glyph: PropTypes.string,
        tooltip: PropTypes.string
    }

    static defaultProps = {
        glyph: '',
        tooltip: ''
    }

    render() {
        return (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="ms-sq-icon">{this.props.tooltip}</Tooltip>}>
                <div className="square-button-md" style={{ cursor: 'default' }}>
                    <Glyphicon style={{margin: 0}} glyph={this.props.glyph}/>
                </div>
            </OverlayTrigger>
        );
    }
}

class ProgessBarCount extends React.Component {
    static propTypes = {
        time: PropTypes.number
    }

    static defaultProps = {
        time: 5
    }

    state = {
        count: 0
    };

    componentWillMount() {
        this.addInterval();
    }

    componentWillUpdate(newProps) {
        if (this.props.time !== newProps.time) {
            clearInterval(this.interval);
            this.addInterval();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <ProgressBar now={100 - this.state.count} />;
    }

    addInterval() {
        this.count = 0;
        let last = new Date().getTime();
        this.setState({
            count: 0
        });
        this.interval = setInterval(() => {
            let now = new Date().getTime();
            let distance = now - last;
            this.count += (distance % (1000 * 60)) / 1000;
            let perc = this.count * 100 / this.props.time;
            if (perc > 100) {
                this.count = 0;
                perc = this.count;
            }
            this.setState({
                count: perc
            });
            last = new Date().getTime();
        }, 1000);
    }
}

class DefaultLayer extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        propertiesChangeHandler: PropTypes.func,
        onToggle: PropTypes.func,
        onContextMenu: PropTypes.func,
        onSelect: PropTypes.func,
        style: PropTypes.object,
        sortableStyle: PropTypes.object,
        activateLegendTool: PropTypes.bool,
        activateOpacityTool: PropTypes.bool,
        visibilityCheckType: PropTypes.string,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array,
        additionalTools: PropTypes.array,
        legendOptions: PropTypes.object,
        currentLocale: PropTypes.string,
        selectedNodes: PropTypes.array,
        filterText: PropTypes.string,
        onUpdateNode: PropTypes.func
    };

    static defaultProps = {
        style: {},
        sortableStyle: {},
        propertiesChangeHandler: () => {},
        onToggle: () => {},
        onContextMenu: () => {},
        onSelect: () => {},
        activateLegendTool: false,
        activateOpacityTool: true,
        visibilityCheckType: "glyph",
        additionalTools: [],
        currentLocale: 'en-US',
        selectedNodes: [],
        filterText: '',
        onUpdateNode: () => {}
    };

    state = {
        time: 1,
        currentTime: 0,
        opacity: 100
    };

    componentWillMount() {
        this.setState({
            enableSynch: this.props.node.synced
        });
    }

    componentWillUpdate(newProps, newState) {
        if (newState.time !== this.state.time) {
            /*setTimeout(() => {

            });*/
        }
    }

    renderCollapsible = () => {
        // const layerOpacity = this.state.opacity !== undefined ? Math.round(this.state.opacity * 100) : 100;
        return (
            <div key="legend" position="collapsible" className="collapsible-toc">
                <Grid fluid>
                    {this.props.activateOpacityTool ?
                    <Row>
                        <Col xs={3}>
                            <SquareIcon tooltip={"Change layer opacity"} glyph="adjust"/>
                        </Col>
                        <Col xs={9} className="mapstore-slider with-tooltip">
                            <Slider start={[this.state.opacity]}
                                disabled={!this.props.node.visibility}
                                range={{min: 0, max: 100}}
                                tooltips
                                format={{
                                    from: value => Math.round(value),
                                    to: value => Math.round(value) + ' %'
                                }}
                                onChange={(opacity) => {
                                    if (isArray(opacity) && opacity[0]) {
                                        this.setState({
                                            opacity: parseFloat(opacity[0].replace(' %', ''))
                                        });
                                    }
                                }}/>
                        </Col>
                    </Row> : null}
                    <Row>
                        <Col xs={3}>
                            <ButtonT tooltip={this.state.enableSynch ? 'Disable layer auto refresh' : 'Enable layer auto refresh'} className="square-button-md" bsStyle={this.state.enableSynch ? 'success' : 'primary'} onClick={() => {
                                this.setState({
                                    enableSynch: !this.state.enableSynch
                                });
                            }}>
                                <Glyphicon style={{margin: 0, color: '#ffffff'}} glyph="time"/>
                            </ButtonT>
                        </Col>
                        <Col xs={9} className="mapstore-slider with-tooltip">
                            <Slider start={[this.state.time]}
                                disabled={this.state.enableSynch}
                                range={{min: 0, max: timeValue.length - 1}}
                                tooltips
                                step={1}
                                format={{
                                    from: value => value,
                                    to: value => timeValue[value].label
                                }}
                                onChange={(time) => {
                                    if (isArray(time) && time[0]) {
                                        this.setState({
                                            time: timeValue.reduce((a, t, i) => time[0] === t.label ? i : a, 0)// parseFloat(time[0].replace(' s', ''))
                                        });
                                    }
                                }}/>
                        </Col>
                    </Row>
                    {this.props.activateLegendTool ?
                    <Row>
                        <Col xs={12}>
                            <img src={require('../plugins/dashboard/img/legend-r.png')}/>
                        </Col>
                    </Row> : null}
                </Grid>
            </div>);
    };

    renderVisibility = () => {
        return this.props.node.loadingError === 'Error' ?
            (<LayersTool key="loadingerror"
                glyph="exclamation-mark text-danger"
                tooltip="toc.loadingerror"
                className="toc-error"/>)
            :
            (<VisibilityCheck key="visibilitycheck"
                tooltip={this.props.node.loadingError === 'Warning' ? 'toc.toggleLayerVisibilityWarning' : 'toc.toggleLayerVisibility'}
                node={this.props.node}
                checkType={this.props.visibilityCheckType}
                propertiesChangeHandler={this.props.propertiesChangeHandler}/>);
    }

    renderToolsLegend = (isEmpty) => {
        return this.props.node.loadingError === 'Error' || isEmpty ?
                null
                :
                (<LayersTool
                    node={this.props.node}
                    tooltip="toc.displayLegendAndTools"
                    key="toollegend"
                    className="toc-legend"
                    ref="target"
                    glyph="chevron-left"
                    onClick={(node) => this.props.onToggle(node.id, node.expanded)}/>);
    }

    renderNode = (grab, hide, selected, error, warning, other) => {
        const isEmpty = !this.props.activateLegendTool && !this.props.activateOpacityTool;
        return (
            <Node className={'toc-default-layer' + hide + selected + error + warning} sortableStyle={this.props.sortableStyle} style={this.props.style} type="layer" {...other}>
                {this.state.enableSynch && <ProgessBarCount time={timeValue[this.state.time].value}/>}
                <div className="toc-default-layer-head">
                    {grab}
                    {this.renderVisibility()}
                    <Title filterText={this.props.filterText} node={this.props.node} currentLocale={this.props.currentLocale} onClick={this.props.onSelect} onContextMenu={this.props.onContextMenu}/>
                    {this.props.node.loading ? <div className="toc-inline-loader"></div> : this.renderToolsLegend(isEmpty)}
                </div>
                {isEmpty ? null : this.renderCollapsible()}
            </Node>
        );
    }

    render() {
        let {children, propertiesChangeHandler, onToggle, ...other } = this.props;

        const hide = !this.props.node.visibility || this.props.node.invalid ? ' visibility' : '';
        const selected = this.props.selectedNodes.filter((s) => s === this.props.node.id).length > 0 ? ' selected' : '';
        const error = this.props.node.loadingError === 'Error' ? ' layer-error' : '';
        const warning = this.props.node.loadingError === 'Warning' ? ' layer-warning' : '';
        const grab = other.isDraggable ? <LayersTool key="grabTool" tooltip="toc.grabLayerIcon" className="toc-grab" ref="target" glyph="menu-hamburger"/> : <span className="toc-layer-tool toc-grab"/>;
        const filteredNode = this.filterLayers(this.props.node) ? this.renderNode(grab, hide, selected, error, warning, other) : null;

        return !this.props.filterText ? this.renderNode(grab, hide, selected, error, warning, other) : filteredNode;
    }

    filterLayers = (layer) => {
        const translation = isObject(layer.title) ? layer.title[this.props.currentLocale] || layer.title.default : layer.title;
        const title = translation || layer.name;
        return title.toLowerCase().includes(this.props.filterText.toLowerCase());
    }
}

module.exports = DefaultLayer;