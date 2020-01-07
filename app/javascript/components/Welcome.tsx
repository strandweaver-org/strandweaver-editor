import * as React from "react"


interface IWelcomeProps {
  greeting: string;
}

interface IWelcomeState {
}

class Welcome extends React.Component <IWelcomeProps, IWelcomeState> {
  render() {
    return (
      <React.Fragment>
        Greeting: {this.props.greeting}
      </React.Fragment>
    );
  }
}

export default Welcome
