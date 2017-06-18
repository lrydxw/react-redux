import * as React from 'react';
import Server from '../../pub/Server';
import { Table, Input, Button } from 'antd';
import Tool from '../../pub/Tool';
import CourseHourApi from '../Course/CourseHourApi';

interface UploadComponentProps {
    onSubmit?: Function;
}

class UploadComponent extends React.Component<UploadComponentProps, any>{
    searchData: any;
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.initCourseShareList = this.initCourseShareList.bind(this);

        this.searchData = {};
        this.state = {
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 6, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//当前选择的Id
            selectedRows: [],
            TableData: [],//列表数据
            Keywords: "",
        };
    }
    componentDidMount() {
        this.initCourseShareList();
    }
    initCourseShareList() {
        var _self = this;
        var obj = _self.searchData;
        obj.PageIndex = _self.state.PageIndex;
        obj.PageSize = _self.state.PageSize;
        obj.CourseTitle = _self.state.Keywords;
        if (obj.CourseTitle)
            obj.PageIndex = 1;

        _self.setState({ loadingTable: true });
        CourseHourApi.getCourseHourPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _self.state.TableData = functionData;
                _self.state.TotalCount = data.AllCount;
            } else {
                _self.state.TableData = [];
                _self.state.TotalCount = 0;
            }
            _self.setState({ loadingTable: false });
        });

    }
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }
    inputonChange(e) {
        var _self = this;
        _self.state.Keywords = e.target.value;
    }
    onSubmit(e) {
        e.preventDefault();
        var _self = this;
        var obj = obj || {}, selectData = [];
        var selectedRows = _self.state.selectedRows, courseTitle = "";
        for (var i = 0; i < selectedRows.length; i++) {
            selectData.push({ Id: selectedRows[i].Id, LecturerId: selectedRows[i].LecturerId, PSAId: "", Tags: "", Price: 0 });
        }
        obj.SiteDatas = selectData;
        _self.props.onSubmit(obj);
    }
    render() {
        var _self = this;
        const tableColumns = [
            {
                title: '课时封面',
                dataIndex: 'ShowImgUrl',
                key: 'ShowImgUrl',
                render: (text, record) =>
                    <div className="clearfix">
                        <img className="pull-left margin-right10" src={record.ShowImgUrl} title={Tool.cutString(record.CourseTitle, 14)} width="52" />
                    </div>,
            },
            {
                title: '课时名称',
                dataIndex: 'CourseTitle',
                key: 'CourseTitle',
                width: '40%',
                render: (text, record) =>
                    <div className="clearfix">
                        <div className="pull-left col-xs-12">
                            <p>
                                <span>第{record.CourseNo}期</span>&nbsp; &nbsp;
                                <a className="color-blue font12">{text}</a>
                            </p>
                        </div>
                    </div>,
            },
            {
                title: '讲师',
                dataIndex: 'LecturerName',
                key: 'LecturerName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '播课形式',
                dataIndex: 'CourseType',
                key: 'CourseType',
                render: (text) => <span> {text}</span>,
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.IsPurchase,
            }),
        };
        const hasSelected = selectedRowKeys.length > 0;
        const pagination = {
            total: _self.state.TotalCount,
            showSizeChanger: false,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                _self.state.PageIndex = current;
                _self.state.PageSize = pageSize;
                _self.initCourseShareList();
            },
            onChange(current) {
                _self.state.PageIndex = current;
                _self.initCourseShareList();
            },
            showTotal() {
                return `共 ${_self.state.TotalCount} 条`;
            },
            pageSize: _self.state.PageSize,
            current: _self.state.PageIndex
        };
        return (
            <div>
                <div className="row  margin-btm20">
                    <div className="col-xs-6 col-xs-offset-6">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="课时名称" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.initCourseShareList} />
                            <span className="input-group-addon  search-btn" onClick={this.initCourseShareList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Table
                                rowKey={record => record.Id}
                                columns={tableColumns}
                                dataSource={this.state.TableData}
                                pagination={pagination}
                                loading={this.state.loadingTable}
                                rowSelection={rowSelection}
                                onRowClick={
                                    (record, index) => {
                                        this.setState({
                                            selectedRowIndex: index,
                                            selectedRowId: record.Id
                                        });
                                    }
                                }
                                rowClassName={
                                    (record, index) => {
                                        return index === this.state.selectedRowIndex ? " ant-table-row-active " : "";
                                    }
                                }
                                />
                        </div>
                    </div>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12 text-center">
                        <Button type="primary" disabled={!hasSelected} onClick={this.onSubmit}>上传到共享库</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export { UploadComponent };