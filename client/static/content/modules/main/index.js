/**
 * Created with 李雪洋.
 * Date: 2017/5/5
 * Time: 14:36
 */
import React from "react";


class Main extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

}

export default Main;