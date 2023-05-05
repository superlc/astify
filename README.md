# astify

This small library is create to simplify the transforming javascript literal to babel literal node.

### usage

1. import the package
``` ts
import astify from 'babel-astify/dist/index';
```

2. call the function
```
astify(3);
astify(null);
astify('cluo');
astify({ name: 'cluo' });
astify(['hell', 'cluo']);
```