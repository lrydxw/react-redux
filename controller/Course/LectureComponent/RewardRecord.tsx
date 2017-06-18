import * as React from 'react';
import Server from '../../../pub/Server';

import { Table } from 'antd';

const RewardApi = {
    getRewardRecordList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetRewardRecordList",
            basciInfo
        );
    },

}

interface RewardRecordProps {
    LectureId: string
    IsReward: boolean
}

class RewardRecord extends React.Component<RewardRecordProps, any>{
    searchData: any;
    constructor(props) {
        super(props);
        this.initRewardRecordList = this.initRewardRecordList.bind(this);
        this.state = {
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            searchData: null,
            Keywords: null,
            loadingRewardRecord: false,
        };
        this.searchData = {};
    }

    componentDidMount() {
        this.initRewardRecordList();
    }
    /**
     * 获取列表数据
     */
    initRewardRecordList() {
        var self = this;
        var obj = self.searchData;
        obj.PageIndex = self.state.PageIndex;
        obj.PageSize = self.state.PageSize;
        obj.Keywords = self.state.Keywords;
        obj.LectureId = self.props.LectureId;
        obj.IsReward = self.props.IsReward;
        if (obj.Keywords)
            obj.PageIndex = 1;

        self.state.visibleForm = false;
        self.setState({ loadingRewardRecord: true });
        RewardApi.getRewardRecordList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                self.state.RewardRecordData = functionData;
                self.state.RewardRecordCount = data.AllCount;
            }
            self.setState({ loadingRewardRecord: false });
        });
    }

    render() {
        var self = this;
        const LecturerColumns = [];
        if (self.props.IsReward) {
            LecturerColumns.push({
                title: '订单编号',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            });
        }
        LecturerColumns.push(
            {
                title: self.props.IsReward ? "打赏金额" : "提现金额",
                dataIndex: 'RewardMoney',
                key: 'RewardMoney',
                render: (text) => <span> {text}</span>,
            },
            {
                title: self.props.IsReward ? "打赏时间" : "提现时间",
                dataIndex: 'RewardTime',
                key: 'RewardTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '说明',
                dataIndex: 'Remark',
                key: 'Remark',
                render: (text) => <span> {text}</span>,
            }
        );
        const pagination = {
            total: self.state.RewardRecordCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initRewardRecordList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initRewardRecordList();
            },
            showTotal() {
                return `共 ${self.state.RewardRecordCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return <Table
            rowKey={record => record.Id}
            columns={LecturerColumns}
            dataSource={this.state.RewardRecordData}
            pagination={pagination}
            loading={this.state.loadingRewardRecord}
            rowClassName={
                (record, index) => {
                    return index === this.state.selectLecturerIndex ? " ant-table-row-active " : "";
                }
            }
            />
            ;
    }
}

export { RewardRecord };