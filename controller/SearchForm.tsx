import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Form, Input, InputNumber, FormProps, Upload, Icon, Modal, Select, DatePicker} from 'antd';

const Option = Select.Option;

const FormItem = Form.Item;

class SearchForm extends React.Component<any, any> {
    searchData: any;
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.searchForm = this.searchForm.bind(this);
    }

    //查询事件
    searchForm() {
        var form = this.props.form;
        var obj = form.getFieldsValue();

        this.props.onSearch(obj);
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        var searchItems = this.props.searchPara.map(function (comment) {
            if (comment.type == 'Input') {
                return (
                    <FormItem  key={comment.key}  label={comment.name} >
                        <Input placeholder={comment.message}  {...getFieldProps(comment.key) } />
                    </FormItem>
                );
            }
            else if (comment.type == 'Select') {
                var reactid = 0;
                var selectItems = comment.dataList.map(function (item) {
                    return (
                        <Option key={comment.key + '_' + reactid++} value={item.value}>{item.key}</Option>
                    );
                });
                return (
                    // <FormItem  key={comment.key}  label={comment.name} >
                    //    <Select defaultValue={comment.defaultValue} style={{ width: 120 }} {...getFieldProps(comment.key)}>

                    //    </Select>
                    //</FormItem>
                    <FormItem  key={comment.key}  label={comment.name} >
                        <Select defaultValue={comment.defaultValue}{...getFieldProps(comment.key) } style={{ width: 120 }} >
                            {selectItems}
                        </Select>
                    </FormItem>
                );
            }
            else if (comment.type == 'DatePicker') {
                return (
                    <FormItem  key={comment.key}  label={comment.name} {...getFieldProps(comment.key) }>
                        <DatePicker format="yyyy-MM-dd"  />
                    </FormItem>
                );
            }
            else if (comment.type == 'TimePicker') {
                return (
                    <FormItem  key={comment.key}  label={comment.name} {...getFieldProps(comment.key) }>
                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss"  />
                    </FormItem>
                );
            }
        });
        return (
            <Form inline form={this.props.form}>
                {searchItems}
                <Button type="primary" icon="search" onClick={this.searchForm}   >查询</Button>
            </Form>
        );
    }
}

export default SearchForm;
