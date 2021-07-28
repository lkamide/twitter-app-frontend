import React from 'react';
import { ToastNotification } from 'carbon-components-react';
import Transition from 'react-transition-group/Transition';

const duration = 300;

const defaultStyle = {
    position: 'fixed',
    top: '10%',
    right: '-270px',
    zIndex: '1000'
};

const transitionStyles = {
    entered: {
        transform: 'translateX(-100%)',
        transition: `transform ${duration}ms ease-in-out`
    },
    exiting: {
        transform: 'translateX(100%)',
        transition: `transform ${duration}ms ease-in-out`
    },
    exited: {
        right: '-270px'
    }
};

const Notification = ({notification }) => {
  console.log(notification)
  console.log(duration)
    return (
        <Transition in={notification} timeout={100} unmountOnExit>
            {(state) => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    <ToastNotification
                        title={notification.title}
                        kind={notification.kind}
                        subtitle={notification.subtitle}
                        hideCloseButton={notification.close || false}
                        caption={notification.caption || "" }
                    />
                </div>
            )}
        </Transition>
    );
}

export default Notification;