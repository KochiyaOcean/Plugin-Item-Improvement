fs = require "fs-extra"
path = require 'path-extra'
{React, ReactBootstrap} = window
{Panel, Button, Nav, NavItem, Col, Grid, Row, Table, Input} = ReactBootstrap
Divider = require './divider'
{SlotitemIcon} = require "#{ROOT}/views/components/etc/icon"

__ = i18n.main.__.bind(i18n.main)
try
  require('poi-plugin-translator')
catch error
  console.log error

DATA = fs.readJsonSync path.join(__dirname, "..", "assets", "data.json")

ItemInfoRow = React.createClass
  render: ->
    <tr>
      <td style={{paddingLeft: 20}}>
        <Input type="checkbox" checked={@props.highlight} onClick={@props.onClick} />
        <SlotitemIcon slotitemId={@props.icon} />
        {@props.type}
      </td>
      <td>{@props.name}</td>
      <td>{@props.hisho}</td>
      <td>{@props.screw.begin.nonconfirm}/{@props.screw.begin.confirm}</td>
      <td>{@props.screw.mid.nonconfirm}/{@props.screw.mid.confirm}</td>
      <td>{@props.screw.max.nonconfirm}/{@props.screw.max.confirm}</td>
    </tr>

ItemInfoArea = React.createClass
  getRows: ->
    {day} = @state
    rows = []
    for item in DATA
      hishos = []
      for secretary in item.secretary
        if secretary.day[day]
          hishos.push window.i18n.resources.__ secretary.name
      highlight = item.id in @state.highlights
      if hishos.length > 0
        row =
          id: item.id
          icon: item.icon
          type: window.i18n.resources.__ item.type
          name: window.i18n.resources.__ item.name
          hisho: hishos.join(' / ')
          highlight: highlight
          screw: item.comsumption.screws
          equipment: item.comsumption.equipment
        rows.push row
    return rows
  getInitialState: ->
    day = (new Date).getUTCDay()
    if (new Date).getUTCHours() >= 15
      day = (day + 1) % 7
    day: day
    highlights: config.get('plugin.ItemImprovement.highlights', [])
  handleKeyChange: (key) ->
    @setState
      day: key
  handleClickItem: (id) ->
    {highlights} = @state
    if id in highlights
      highlights = highlights.filter (v) -> v != id
    else
      highlights.push(id)
    config.set('plugin.ItemImprovement.highlights', highlights)
    @setState
      highlights: highlights

  render: ->
    rows = @getRows()
    <Grid id="item-info-area">
      <div id='item-info-settings'>
        <Divider text={__ "Weekday setting"} />
        <Grid className='vertical-center'>
          <Col xs={12}>
            <Nav bsStyle="pills" activeKey={@state.day} onSelect={@handleKeyChange}>
              <NavItem eventKey={0}>{__ "Sunday"}</NavItem>
              <NavItem eventKey={1}>{__ "Monday"}</NavItem>
              <NavItem eventKey={2}>{__ "Tuesday"}</NavItem>
              <NavItem eventKey={3}>{__ "Wednesday"}</NavItem>
              <NavItem eventKey={4}>{__ "Thursday"}</NavItem>
              <NavItem eventKey={5}>{__ "Friday"}</NavItem>
              <NavItem eventKey={6}>{__ "Saturday"}</NavItem>
            </Nav>
          </Col>
        </Grid>
        <Divider text={__ "Improvement information"} />
        <Grid>
          <Table striped condensed hover id="main-table">
          <thead className="item-table">
            <tr>
              <th width="200" ><div style={paddingLeft: '55px'}>{__ "Type"}</div></th>
              <th width="250" >{__ "Name"}</th>
              <th width="200" >{__ "2nd Ship"}</th>
              <th width="100" >螺丝耗费0~6</th>
              <th width="100" >螺丝耗费6~max</th>
              <th width="100" >螺丝耗费max</th>
            </tr>
          </thead>
          <tbody>
          {
            if rows?
              results = []
              for row, index in rows
                if row.highlight
                  results.push <ItemInfoRow
                    key = {row.id}
                    icon = {row.icon}
                    type = {row.type}
                    name = {row.name}
                    hisho = {row.hisho}
                    highlight = {row.highlight}
                    onClick = {@handleClickItem.bind(@, row.id)}
                    screw = {row.screw}
                    equipment = {row.equipment}
                  />
              for row, index in rows
                if not row.highlight
                  results.push <ItemInfoRow
                    key = {row.id}
                    icon = {row.icon}
                    type = {row.type}
                    name = {row.name}
                    hisho = {row.hisho}
                    highlight = {row.highlight}
                    onClick = {@handleClickItem.bind(@, row.id)}
                    screw = {row.screw}
                    equipment = {row.equipment}
                  />
              results
            }
          </tbody>
          </Table>
        </Grid>
      </div>
    </Grid>

ReactDOM.render <ItemInfoArea />, $('item-improvement')
