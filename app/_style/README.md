# Conventions

 * File names should be lower case with dashes (-) i.e. `content-box.less`
 
 * Local variables should be prefixed with @`component-name`
 
 * Using BEM (Block, Element, Modifier) to keep nested selectors low, for components
    - `text-box` block
    - `text-box__header` - element
    - `text-box__content` - element
    - `text-box__footer` - element
    - `text-box__footer--active` - modifier
    
 * Use mixins to describe common properties
 
 * Be semantic in class names, i.e.
    - `input-toggle` instead of `box 16wide blue`
    - instead, mix in these properties in less, with `.blue`, `.16wide` and `box`
 
 * Try to put the most generic selectors as close to the top of the file as possible, or mimic the visual structure
   ( `__header` above `__footer` )
 
## Component structure

    .component {
    
        .some-mixin;
        some: property;
        
        
        &__header,
        &__content,
        &__footer {
            // shared between header, content and footer
        }
        &__header {
            // specific for header
        }
        
        &__content {
            // specific for content
        }
        
        &__footer {
            // specific for footer
            &--active {
                // in the active state
            }
        }
    }
    
## HTML Example

Using BEM means you have to type a little bit more in HTML, but it's a tradeoff

    <div class="component">
        <div class="component__header"></div>
        <div class="component__content"></div>
        <div class="component__footer"></div>
    </div>
    
And when the footer is active

    <div class="component">
        <div class="component__header"></div>
        <div class="component__content"></div>
        <div class="component__footer component__footer--active"></div>
    </div>