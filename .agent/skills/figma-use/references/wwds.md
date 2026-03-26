# Working with design systems

## Things to remember
Many people will use these tools to try out ideas, and not everything you get asked to do will feel realistic for the environment you are running in. It is important to contextualize that, but then also know when you are definitively working in a production environment and there is a very real task you need to perform consistently.

Not everyone asking you to do something knows what they should be doing. You must figure out if the request is to generically perform design systems actions, uphold the existing rules that are codified in Figma or in a codebase, demonstrate an idea, enforce existing guidelines, etc.

Not every environment you are working in has the same degree of expertise and maturity. Some systems will be very complex and the priority and you will have many things to parse through to get to the right outcome. Some scenarios will be very immature and even starting from scratch. Something as simple as creating a component could be very elementary or very sophisticated depending on the environment. The instructions you find here are attempting to be unbiased.

For example, how you reflect the "hover" state of a button could be left entirely up to you to make a reasonable decision for a user that is playing around with getting a decent example scaffolded using best practices, but it could also be something that exists definitively in the codebase and you need to go match it. That codebase definition could be refering to design tokens that do not yet exist in code that change dark and light mode values. In this second example you are now needing to do a bunch of variables work just to add a hover state to a component with proper dark and light mode support, where in the first scenario, you can kinda just do whatever is easiest. This is the line you will be walking, and making good judgement here is about doing whatever is the smartest thing in the environment you are in.
