import * as React from 'react';
import * as ReactDOM from 'react-dom';

class UIShopLeft extends React.Component<any, any> {
    //初始化加载
    constructor(props) {

        super(props);


    }


    render() {
        return (
            <div className="padding-left15 padding-right15 editor-left-main2">
                敬请期待
            </div>

        );
    }
}


class UIShopRight extends React.Component<any, any>{

    render() {
        return (
            <div>
                敬请期待
            </div>
        );
    }
}
export {
UIShopLeft, UIShopRight
}

