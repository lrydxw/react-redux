import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Form, Cascader, Switch, Checkbox, Radio, Input, InputNumber, FormProps, Upload, Icon, Modal, Select, DatePicker, FormComponentProps, CreateFormOptions} from 'antd';
  
//文本编辑器
import {Editor} from '../components/editor/editor';

const Option = Select.Option;

const FormItem = Form.Item;

const CheckboxGroup = Checkbox.Group;

const RadioGroup = Radio.Group;

enum ElementEnum {
    /** 文本框 */
    Input,
    /** 多行输入 */
    Textarea,
    /** 数字文本框 */
    InputNumber,
    /** 下拉选择框 */
    Select,
    /** 日期选择框 格式  2016-09-07*/
    DatePicker,
    /** 日期选择框 格式  2016-09-07 11:22:20*/
    TimePicker,
    /** 单选框 **/
    Radio,
    /** 复选框 **/
    Checkbox,
    /** 级联选择 **/
    Cascader,
    /** 开关 **/
    Switch,
    /** 文件上传 **/
    Upload,
    /** 文本编辑器 **/
    Editor
}



/** 表单元素定义 */
interface FormElement {
    /** 表单元素绑定属性 */
    key: string;
    /** 表单元素类型 */
    element: ElementEnum;
    type: string;
    label: string;
    options?: Array<any>;
    message?: string;
    defaultValue?: any,
    rules?: { required?: boolean, whitespace?: boolean, validator?: Function };
    dataList?: Array<any>;
    min?: number;
    max?: number;
    config?: any;
    step?: any;
}

interface FormElementProps extends FormComponentProps {
    /** 表单元素 */
    formElements?: Array<FormElement>;
    /** 表单提交方法 */
    onSubmit?: Function;
    /** 取消方法 */
    onCancel?: Function;
    defaultValues?: Object;
    form?: any;
    editId?: any;
}

class ModalForm extends React.Component<FormElementProps, any> {
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
        this.onSubmit = this.onSubmit.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        //初始化表单 
        this.initForm = this.initForm.bind(this);

    }



    //表单提交事件
    onSubmit(e) {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!' + JSON.stringify(errors));
                return;
            }
            console.log('Submit!!!');
            console.log(values);



            var form = this.props.form;
            var obj = form.getFieldsValue();

            //console.log('values：', JSON.stringify(values));

            //console.log('obj：', JSON.stringify(obj));

            this.props.onSubmit(obj);
        });


    }


    //表单提交事件
    onCancel(e) {
        e.preventDefault(); 
        this.props.form.resetFields();
        this.props.onCancel();
    }

    checkPass(rule, value, callback) {
        if (value && !(/^\d+$/).test(value.toString().trim())) {
            callback('只能为数字。');
        }
        else {
            callback();
        }
    }

    //插入真实DOM之前被执行 
    componentWillMount() {
        var _this = this;
        //this.setState({ });
        _this.state = {
            formElements: this.props.formElements
        };

        ////初始化表单
        //this.initForm();
    }



    //插入真实DOM之后被执行
    componentDidMount(nextProps) {
        console.log('执行组件componentDidMount' + nextProps);
    }


    //更新DOM之前被执行
    componentWillUpdate() {
        console.log('执行组件componentWillUpdate');
    }

    //更新DOM之后被执行
    componentDidUpdate() {
        console.log('执行组件componentDidUpdate');
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log('执行组件componentWillUnmount');
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        console.log('执行组件componentWillReceiveProps');

        var _this = this;



        if (nextProps.defaultValues !== this.props.defaultValues) {
            const { setFieldsValue } = this.props.form;
            this.props.formElements.map(function (comment, i) {
                var key = comment.key;
                var val = nextProps.defaultValues[comment.key];
                //时间转换
                if (comment.type == "date") val = new Date(val);
                //数值转换为string
                if (comment.type == "number" || comment.type == "integer" || comment.type == "float" || comment.type == "boolean") val = String(val);
                if (comment.element === ElementEnum.Editor) {
                    _this.state[comment.key + "EditorContent"] = val;
                }
                else if (comment.element === ElementEnum.InputNumber) {
                    _this.state[comment.key + "InputNumber"] = val;
                }
                else if (comment.element === ElementEnum.Upload) {
                    _this.state[comment.key + "FileList"] = undefined;
                }

                var obj = new Object();
                obj[key] = val;
                setFieldsValue(obj);

                console.log(i + "_" + key + ":" + val);
            });
        }

        if (nextProps.formElements !== this.state.formElements) {
            this.setState({ formElements: nextProps.formElements });
        }
    }

    initForm() {
        var _this = this;
        console.log("this.props" + JSON.stringify(this.props));
        //if (nextProps.defaultValues !== this.props.defaultValues) {
        const { setFieldsValue } = this.props.form;
        this.props.formElements.map(function (comment, i) {
            var key = comment.key;
            var val = _this.props.defaultValues[comment.key];
            //时间转换
            if (comment.type == "date") val = new Date(val);
            //数值转换为string
            if (comment.type == "number" || comment.type == "integer" || comment.type == "float" || comment.type == "boolean") val = String(val);
            if (comment.element === ElementEnum.Editor) {
                _this.state[comment.key + "EditorContent"] = val;
            }
            else if (comment.element === ElementEnum.InputNumber) {
                _this.state[comment.key + "InputNumber"] = val;
            }
            else if (comment.element === ElementEnum.Upload) {
                _this.state[comment.key + "FileList"] = undefined;
            }

            var obj = new Object();
            obj[key] = val;
            setFieldsValue(obj);

            //console.log(i + "_" + key + ":" + val);
        });
        //}

        //if (nextProps.formElements !== this.state.formElements) {
        // this.setState({ formElements: nextProps.formElements });
        //}
    }


    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }


    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const {checkPass} = this;
        const { setFieldsValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        var formItems = createElements(this, this.state.formElements);

        return (
            <Form horizontal>
                {formItems}
                <FormItem
                    wrapperCol={{ span: 12, offset: 7 }}
                    >
                    <Button type="primary" onClick={this.onSubmit}>确定</Button>
                    &nbsp; &nbsp; &nbsp;
                    <Button type="ghost" onClick={this.onCancel}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

let FormTemplate = Form.create()(ModalForm)

let createElements = function (_this: any, elements: Array<FormElement>): JSX.Element[] {
    const { setFieldsValue, getFieldProps, getFieldValue, getFieldError, isFieldValidating } = _this.props.form;
    if (_this.state.priviewVisible === undefined) {
        _this.state.priviewVisible = false;
        _this.state.priviewImage = "";
    }
    const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 12 },
    };
    let handleCancel = function () {
        _this.setState({
            priviewVisible: false,
        });
    } 

    let locale = {
        timezoneOffset: 8 * 60,
        firstDayOfWeek: 1,
        minimalDaysInFirstWeek: 1,

        lang: {
            today: '今天',
            now: '此刻',
            ok: '确定',
            clear: '清除',
            previousMonth: '上个月 (翻页上键)',
            nextMonth: '下个月 (翻页下键)',
            placeholder: '请选择日期',
            timePlaceholder: '请选择时间',
            monthSelect: '选择月份',
            yearSelect: '选择年份',
            decadeSelect: '选择年代',
            hourInput: '上一小时(上方向键), 下一小时(下方向键)',
            minuteInput: '上一分钟(上方向键), 下一分钟(下方向键)',
            secondInput: '上一秒(上方向键), 下一小时(下方向键)',
            hourPanelTitle: '选择小时',
            minutePanelTitle: '选择分钟',
            secondPanelTitle: '选择秒',
            yearFormat: 'yyyy\'年\'',
            monthFormat: 'M\'月\'',
            dateFormat: 'yyyy\'年\'M\'月\'d\'日\'',
            previousYear: '上一年 (Control键加左方向键)',
            nextYear: '下一年 (Control键加右方向键)',
            previousDecade: '上一年代',
            nextDecade: '下一年代',
            previousCentury: '上一世纪',
            nextCentury: '下一世纪',

            format: {
                eras: ['公元前', '公元'],
                months: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四',
                    '星期五', '星期六'],
                shortWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五',
                    '周六'],
                veryShortWeekdays: ['日', '一', '二', '三', '四', '五', '六'],
                ampms: ['上午', '下午'],
                datePatterns: ["yyyy'年'M'月'd'日' EEEE", "yyyy'年'M'月'd'日'", "yyyy-M-d", "yy-M-d"],
                timePatterns: ["ahh'时'mm'分'ss'秒' 'GMT'Z", "ahh'时'mm'分'ss'秒'", "H:mm:ss", "ah:mm"],
                dateTimePattern: '{date} {time}'
            }
        }
    };

    var formItems = elements.map(function (comment) {
        const rule = comment.rules;

        if (comment.element == ElementEnum.Input) {   //输入框
            const inputProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, whitespace: rule.whitespace, message: comment.message },
                    { validator: rule.validator },
                ],
            });
            return (
                <FormItem  key={comment.key}
                    {...formItemLayout}
                    label= { comment.label }
                    hasFeedback
                    >
                    <Input type="text" placeholder={comment.message}  {...inputProps} />
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Textarea) {   //多行输入框
            const textareaProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, whitespace: rule.whitespace, message: comment.message },
                    { validator: rule.validator },
                ],
            });
            return (
                <FormItem  key={comment.key}
                    {...formItemLayout}
                    label= { comment.label }
                    hasFeedback
                    >
                    <Input type="textarea" placeholder={comment.message} autosize={{ minRows: 2, maxRows: 6 }} {...textareaProps} />
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.InputNumber) {
            // return (
            //    <FormItem
            //        {...formItemLayout}
            //        label={comment.label}
            //        hasFeedback
            //        >
            //         <InputNumber step={0.1} {...getFieldProps(comment.key, {
            //             validate: [{
            //                 rules: [
            //                     { required: true, whitespace: true, validator: rule.validator },
            //                 ], trigger: ['onBlur', 'onChange'],
            //             }]
            //         }) }/>
            //    </FormItem>
            //);
            if (_this.state[comment.key + "InputNumber"] === undefined) {
                _this.state[comment.key + "InputNumber"] = comment.defaultValue;
            }
            const inputProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, message: comment.message },
                    { validator: rule.validator },
                ],
            });
            const inputNumberProps = {
                onChange: (value) => {
                    if (_this.state[comment.key + "InputNumber"] !== value) {
                        _this.state[comment.key + "InputNumber"] = value;
                        //_this.setState({ testValue: value });
                        var key = comment.key;
                        var val = value;
                        var obj = {};
                        obj[key] = String(val);
                        setFieldsValue(obj);
                    }

                }
            }
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    hasFeedback
                    >
                    <Input {...inputProps}  style={{ display: "none" }} />
                    <InputNumber min={comment.min} max={comment.max} step={comment.step} value= { _this.state[comment.key + "InputNumber"]}  {...inputNumberProps}  />

                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Select) {  //选择器 
            debugger;
            const selectProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, whitespace: rule.whitespace, message: comment.message },
                    { validator: rule.validator },
                ],
            });
            var selectItems = comment.dataList.map(function (item, i) {
                return (
                    <Option key={comment.key + '_' + i} value={item.value}>{item.key}</Option>
                );
            });
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    hasFeedback
                    >
                    <Select  {...selectProps }>
                        {selectItems}
                    </Select>
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.DatePicker) {  //日期选择器  格式：2016-09-06
            const datePickerProps = getFieldProps(comment.key, {
                rules: [
                    {
                        required: rule.required,
                        type: 'date',
                        message: comment.message,
                    }
                ],
            })
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <DatePicker  {...datePickerProps} />
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.TimePicker) { //日期选择器，带时间  格式:2016-09-06 16:35:01
            const timePickerProps = getFieldProps(comment.key, {
                rules: [
                    {
                        required: rule.required,
                        type: 'date',
                        message: comment.message,
                    }
                ],
            })
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <DatePicker locale={locale}  showTime format="yyyy-MM-dd HH:mm:ss"  {...timePickerProps } />
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Cascader) {  //级联选择
            const cascaderProps = getFieldProps(comment.key, {
                rules: [{ required: true, type: 'array', message: comment.message }],
            });

            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <Cascader options={comment.dataList}  placeholder={comment.message} {...cascaderProps}/>
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Switch) {  //开关
            var checked = comment.defaultValue;
            //console.log("Switch：" + checked + "-" + comment.defaultValue);
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <Switch {...getFieldProps(comment.key, {
                        initialValue: false,
                        valuePropName: 'checked',
                    }) }
                        />
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Checkbox) {  //复选框
            const checkboxProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, type: 'array', message: comment.message },
                ],
            });
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <CheckboxGroup options={comment.dataList} disabled  {...checkboxProps }/>
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Radio) {  //单选框
            var radioItems = comment.dataList.map(function (item, i) {
                return (
                    <Radio key={comment.key + '_' + i} value={item.value}>{item.label}</Radio>
                );
            });
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    >
                    <RadioGroup {...getFieldProps(comment.key, {
                        rules: [
                            { required: true, message: comment.message },
                        ],
                    }) }>
                        {radioItems}
                    </RadioGroup>
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Upload) {   //上传  
            //if ((_this.state[comment.key + "FileList"] === undefined || _this.state[comment.key + "FileList"].length < 1) && _this.state[comment.key + "FileCount"] === undefined) {
            if (_this.state[comment.key + "FileList"] === undefined) {
                _this.state[comment.key + "FileList"] = comment.config.defaultFileList;
            }
            const logoProps = {
                multiple: comment.config.multiple,
                action: comment.config.action,
                data: {
                    type: 'course',
                    format: 'large'
                },
                fileList: _this.state[comment.key + "FileList"],
                onChange: (info) => {
                    let fileList = info.fileList;

                    if (comment.config.multiple === false && fileList.length > 1) {
                        fileList = [info.fileList[info.fileList.length - 1]];
                    }

                    // 1. 上传列表数量的限制
                    //    只显示最近上传的一个，旧的会被新的顶掉
                    fileList = fileList;
                    // 2. 读取远程路径并显示链接
                    fileList = fileList.map((file) => {
                        console.log("fileList：" + fileList.length);
                        if (file.response) {
                            // 组件会将 file.url 作为链接进行展示  
                            file.url = file.response.url;
                        }
                        return file;
                    });

                    // 3. 按照服务器返回信息筛选成功上传的文件
                    fileList = fileList.filter((file) => {
                        console.log("filter：" + fileList.length);
                        //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                        if (file.response) {
                            return file.response.status === 'success';
                        }
                        return true;
                    });
                    var key = comment.key;
                    //var val = info.fileList.length > 0 ? info.fileList[0].url : "";
                    var obj = {};
                    var val = "";
                    if (fileList.length > 0) {
                        fileList.map(function (file, i) {
                            if (i === 0) {
                                val += file.url;
                            }
                            else {
                                val += "," + file.url;
                            }
                            //console.log(i + "：" + val);
                        });
                    }
                    obj[key] = val;
                    setFieldsValue(obj);
                    _this.state[comment.key + "FileList"] = fileList;
                    _this.setState(_this.state);
                },
                listType: "picture-card",
                onPreview: (file) => {
                    _this.setState({
                        priviewImage: file.url,
                        priviewVisible: true,
                    })
                }
            };
            const logoPathProps = getFieldProps(comment.key, {
                validate: [{
                    rules: [
                        { required: rule.required, message: comment.message },
                    ],
                    trigger: ['onBlur', 'onChange'],
                },
                ],
            });
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    hasFeedback
                    >
                    <Input {...logoPathProps}    />
                    <div >
                        <Upload {...logoProps}  name="upload"   >
                            <Icon type="plus" />
                            <div className="ant-upload-text" >{comment.label}</div>
                        </Upload>
                        <Modal visible={_this.state.priviewVisible}  footer={null} onCancel={handleCancel}>
                            <img alt="example" src={_this.state.priviewImage} />
                        </Modal>
                    </div>
                </FormItem>
            );
        }
        else if (comment.element == ElementEnum.Editor) {
            if (_this.state[comment.key + "EditorContent"] === undefined) {
                _this.state[comment.key + "EditorContent"] = comment.defaultValue;
            }
            const inputProps = getFieldProps(comment.key, {
                rules: [
                    { required: rule.required, message: comment.message },
                ],
            });
            const editProps = {
                callbackContentChange: (value) => {
                    if (_this.state[comment.key + "EditorContent"] !== value) {
                        _this.state[comment.key + "EditorContent"] = value;
                        var key = comment.key;
                        var val = value;
                        var obj = {};
                        obj[key] = val;
                        setFieldsValue(obj);
                    }
                }
            }
            return (
                <FormItem
                    {...formItemLayout}
                    label={comment.label}
                    hasFeedback
                    >
                    <Input {...inputProps}   />
                    <div >
                        <Editor {...editProps}  value={_this.state[comment.key + "EditorContent"]} id="content"  height="500"  />
                    </div>
                </FormItem>
            );
        }

        //无法绑定值
        //else if (comment.element == ElementEnum.Editor) {
        //    if (_this.state[comment.key + "EditorContent"] === undefined) {
        //        _this.state[comment.key + "EditorContent"] = comment.defaultValue;
        //    }

        //    let getFileValueProps = function (value) {

        //        return {
        //            value: _this.state[comment.key + "EditorContent"]
        //        };
        //    }
        //    //getValueProps 通知修改Input的值，正式方法将取消
        //    const inputProps = getFieldProps(comment.key, { 
        //        getValueProps: getFileValueProps,
        //        validate: [{
        //            rules: [
        //                { required: rule.required, message: comment.message },
        //            ],
        //            trigger: ['onBlur', 'onChange'],
        //        },
        //        ],
        //    });
        //    const editProps = {
        //        callbackContentChange: (value) => {
        //            if (_this.state[comment.key + "EditorContent"] !== value) {
        //                _this.state[comment.key + "EditorContent"] = value;
        //                _this.setState({ testValue: value });
        //            }
        //        }
        //    }
        //    return (
        //        <FormItem
        //            {...formItemLayout}
        //            label={comment.label}
        //            hasFeedback
        //            >
        //            <Input {...inputProps}  ref="test" />
        //            <div >
        //                <Editor {...editProps}  value={_this.state[comment.key + "EditorContent"]} id="content"  height="500"  />
        //            </div>
        //        </FormItem>
        //    );
        //}

    });
    return formItems;
}
export {FormTemplate, ElementEnum, FormElement, createElements};