import React, { Component } from 'react';
import styles from './AppShell.scss';
import cx from 'classnames';

export default class AppShell extends Component {
    render() {
        const danger = true;

        return (
            <div className={cx(styles.AppShell, 'AppShell', { danger: danger })}>
                <div>
                    <h1>This is the AppSaell</h1>
                </div>
            </div>
        );
    }
}
