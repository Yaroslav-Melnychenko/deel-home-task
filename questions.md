# Deel questions

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
PureComponent is an optimized version of Component thats skips re-renders for same props and state.
PureComponent is a subclass of Component, it is shallowly compares props and state.
We can see the same result if we extend Component and have custom shouldComponentUpdate method.

PureComponent can break you app in situation when you pass a function (non primitive value) as a props.
Every time Parent component re-render PureChild will think that onClick prop has changed and PureChild will re-render.
```javascript
  <PureChild name="John" onClick={() => update()} />
```

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?
Method shouldComponentUpdate is responsible for deciding whether a component should update or not by returning true or false.
The context is state manager that build in react. We are using it to avoid props drilling and make the code more structured.
When the context data is changing the components that are using this data also need to be changed (re-render). There are no reason to use shouldComponentUpdate because it has conflicts with context logic. As a result we can have a incorrect state representation. Also we will have an issues with future compatibility, bug fixing and supporting the legacy.
On the other hand react docs do not recommend us to use class components anymore, so there are no reason to use shouldComponentUpdate in a new code at all.

## 3. Describe 3 ways to pass information from a component to its PARENT.
1. Callback Functions: The child component can receive a function as a prop from its parent, and when an event or action occurs in the child component, it can invoke that function and pass the necessary information back to the parent. Here's an example:
```javascript
import React from 'react';

const ParentComponent = () => {
  const getDataFromChild = (data) => {
    console.log(data);
  };

  return (
    <ChildComponent onClick={getDataFromChild} />
  );
};

const ChildComponent = ({ onClick }) => {
  const data = 'Some data from the child';

  const handleClick = () => {
    onClick(data);
  };

  return (
    <button onClick={handleClick}>Send data to parent</button>
  );
};
```

2. Context API: We should create a provider and wrap all our components that we want to access the data. After that we can access the data where we want by wrapping the component to context.
```javascript
const Provider = () => {
  const [data, setData] = useState(null);

  return (
    <MyContext.Provider
      value={{
        data,
        setData
      }}
    >
      <ChildComponent />
    </MyContext.Provider>
  );
};

const Parent = ({ data }) => <div>{data}</div>;

const Child = ({ setData }) => {
  const data = 'Some data from the child';

  const handleClick = () => {
    setData(data);
  };

  return (
    <button onClick={handleClick}>Send data to parent</button>
  );
}
```

3. State Management Libraries, for example Redux: The main logic is the same as in context. But in this scenario we are using the store, reducers and dispatch an actions.

## 4. Give 2 ways to prevent components from re-rendering.
1. React.memo():
```javascript
import React from 'react';

const MyComponent = React.memo(({ data }) => {
  // Component rendering logic here
});
```

2. ShouldComponentUpdate (Class components only):
Please note that Class components not recommended to use (according to react docs)
```javascript
import React from 'react';

class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Custom logic to determine whether the component should update
    // Return true to update, false to prevent re-render
  }

  render() {
    // Component rendering logic here
  }
}
```

## 5. What is a fragment and why do we need it? Give an example where it might break my app.
Fragments let you group a list of children without adding extra nodes to the DOM.
```javascript
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```
You need to be carefully to use a Fragment because it does not add a DOM node, just a virtual DOM container, so your styles can be break.
Also take note that react allows us to return only one element, so in case you want to return multiple elements you should wrap in by some DOM element or Fragment.

## 6. Give 3 examples of the HOC pattern.
1. withLoader
```javascript
export default function withLoader(Element, url) {
  return (props) => {
    const [data, setData] = useState(null);

    const getData = () => {
      // get some data from API
      setData(data);
    }

    useEffect(() => {
      getData();
    }, []);

    if (!data) {
      return <div>Loading...</div>;
    }

    return <Element {...props} data={data} />;
  };
}
```

2. withStyles
```javascript
function withStyles(Component) {
  return props => {
    const style = { padding: '15px', margin: '15px' }
    return <Component style={style} {...props} />
  }
}
 
const Button = () = <button>Click</button>
 
const StyledButton = withStyles(Button)
```

3. withLogger
```javascript
const withLogger = (WrappedComponent) => {
  return (props) => {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.name} mounted.`);

      return () => {
        console.log(`Component ${WrappedComponent.name} will unmount.`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const MyComponent = (props) => {
  return <div>Hello, World!</div>;
};

const MyComponentWithLogger = withLogger(MyComponent);
```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?
1. Callbacks:
Callbacks are a traditional way of handling asynchronous operations in JavaScript. When using callbacks, error handling typically involves passing an error parameter as the first argument to the callback function.
```javascript
function fetchData(callback) {
  // Asynchronous operation
  if (error) {
    callback(new Error('Something went wrong'));
  } else {
    callback(null, result);
  }
}

fetchData(function (err, data) {
  if (err) {
    // Handle the error
  } else {
    // Use the data
  }
});
```

2. Promises:
Promises provide a more structured way of handling asynchronous operations. Promises have built-in error handling capabilities through the .catch() method, which allows you to handle any errors that occur during the promise chain.
```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    // Asynchronous operation
    if (error) {
      reject(new Error('Something went wrong'));
    } else {
      resolve(result);
    }
  });
}

fetchData()
  .then((data) => {
    // Use the data
  })
  .catch((err) => {
    // Handle the error
  })
  .finally(() => {
    // End
  })
```

3. async/await:
Async/await is a syntactic sugar that built on top of promises. It provides us more accurate and easy to read code in a more structured way. Error handling in async/await is done using try/catch blocks.
```javascript
async function fetchData() {
  try {
    // Asynchronous operation
    const result = await somePromise;
    return result;
  } catch (error) {
    throw new Error('Something went wrong');
  }
}

async function main() {
  try {
    const data = await fetchData();
    // Use the data
  } catch (err) {
    // Handle the error
  }
}
```
In summary, all three methods provide ways to handle exceptions in asynchronous operations, promises and async/await offer more structured and easier-to-read error handling mechanisms compared to traditional callbacks.

## 8. How many arguments does setState take and why is it async.
setState allow us to pass 2 parameters: newState object or callback function that returns new state object, callback when setState was happen.
```javascript
this.setState((state) => {
  return {count: state.count + 1}
});

this.setState({ count: 0 });

this.setState({ count: 0 }, () => console.log('state was changed'));
```
Why is it async? React intentionally “waits” until all components call setState() in their event handlers before starting to re-render. This boosts performance by avoiding unnecessary re-renders.

## 9. List the steps needed to migrate a Class to Function Component.
1. use const key word instead of class
2. remove render(), constructor() methods
3. separate state in different states using useState() hook
4. transform all methods like componentDidMount(), etc. to useEffect(), etc.
5. if you have a PureComponent you should use React.memo
This is the general rules, please notice that this steps can be different and depends on the component logic.

## 10. List a few ways styles can be used with components.
1. Modular styles. CSS Modules allow you to write modular CSS by scoping the styles to a specific component.
2. Inline Styles. You can apply styles directly to a React component using the style attribute
3. CSS-in-JS Libraries. For example styled-components
4. CSS Frameworks/Libraries. For example Material-UI, Antd Design

## 11. How to render an HTML string coming from the server.
To render an HTML string that is received from a server in React, you can use the dangerouslySetInnerHTML prop. However, you need to be cautious when using this approach as it can introduce security vulnerabilities
```javascript
import React from 'react';

const ServerHTMLRenderer = ({ htmlString }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
};

export default ServerHTMLRenderer;
```
When using this approach, make sure that the HTML content is trusted and sanitized properly to prevent any potential security risks, such as cross-site scripting (XSS) attacks. You can use third-party libraries like DOMPurify to sanitize the HTML content before rendering it. Here's an example of using DOMPurify to sanitize the HTML content before rendering:
```javascript
import React from 'react';
import DOMPurify from 'dompurify';

const ServerHTMLRenderer = ({ htmlString }) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlString);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
};

export default ServerHTMLRenderer;
```