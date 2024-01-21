# App documentation

- [App documentation](#app-documentation)
  * [Set up and start app](#set-up-and-start-app)
  * [Example articles](#example-articles)
    + [View free article with embedded box](#view-free-article-with-embedded-box)
    + [View free article with no listImage](#view-free-article-with-no-listimage)
  * [Tech stack](#tech-stack)
    + [Why Next.js?](#why-nextjs-)
    + [Why Tailwind CSS?](#why-tailwind-css-)
  * [Responsive design](#responsive-design)
  * [Code formatting](#code-formatting)
  * [Accessibility notes](#accessibility-notes)
    + [Semantic HTML elements](#semantic-html-elements)
    + [Login form](#login-form)
    + [Accessibility improvements](#accessibility-improvements)
    + [Issue 1: "Heading elements are not in a sequentially-descending order"](#issue-1---heading-elements-are-not-in-a-sequentially-descending-order-)
    + [Issue 2: "Image elements do not have [alt] attributes"](#issue-2---image-elements-do-not-have--alt--attributes-)
  * [Authentication notes](#authentication-notes)
  * [What next?](#what-next-)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Set up and start app

```bash
git clone git@github.com:danielrlc/article-view-next.git
cd article-view-next
npm install
npm run dev
```

Go to [localhost:3000](http://localhost:3000/) to view app (with hot reloading).

Build the app for production:

```bash
npm run build
```

## Example articles

### View free article with embedded box

[Trump möter Biden en sista gång – därför kan nattens debatt avgöra valet](http://localhost:3000/article/a6282b95-e620-4040-87d1-731fed85a7d6)

### View free article with no listImage

[Att leva som man lär](http://localhost:3000/article/f0626495-f2ac-4220-9892-44086b12acb5)

This is handled by this code in `/pages/article/[articleId].js`

```jsx
{
  listImage && (
    <figure>
      <img
        src={listImage.url}
        alt={listImage.caption}
        className="w-full mb-1"
      />
      <figcaption className="text-gray-500 text-sm">
        {listImage.caption} {listImage.byline}
      </figcaption>
    </figure>
  )
}
```

## Tech stack

I used [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) to build the app.

### Why Next.js?

Next.js lets you use static and/or server-side rendering (SSR). I used SSR in my app as I think it is a good fit for a site like hbl.fi. SSR has advantages over single-page apps (SPAs) in these areas:
- search engine optimisation (SEO)
- progressive enhancement and accessibility (not relying on client-side JavaScript)
- time to initial render
- authentication (compared with a static site generator like Gatsby, for example)

### Why Tailwind CSS?

Here are some of the main reasons why Tailwind is my favourite CSS framework:
- Tailwind lets you see and manage your CSS right inside your HTML.
- You need to be fairly good at CSS to use Tailwind, and Tailwind helps you improve at CSS, because rather than hiding the CSS away, it makes it far more visible and "in your face".
- Tailwind helps you avoid specificity issues.
- Tailwind helps you avoid writing much CSS of your own.
- Tailwind comes with very few opinions, and can be deeply customised.
- Tailwind makes it easy for you to avoid premature abstraction, but when needed, you can abstract your styles into components.
- You can use [PurgeCSS](https://purgecss.com/) to remove all unused styles when you build your app. (With this app, the minimised, built CSS file is just ~2 kB)

If you haven't used Tailwind CSS before, or some other utility CSS framework, the following line in my code might make you freak out:

```html
<div className="text-gray-500 text-sm my-6 border border-l-0 border-r-0 border-gray-300 py-2 flex justify-between">...</div>
```

But fear not! Tailwind can abstract these classes into a component like this:

```css
.article-meta-box {
  @apply text-gray-500 text-sm my-6 border border-l-0 border-r-0 border-gray-300 py-2 flex justify-between;
}
```

```html
<div className="article-meta-box">...<div>
```

This is what I would do if I wanted to reuse this set of styles elsewhere in the app.

## Responsive design

The app is styled for all screen sizes. On mobile, screen real estate is maximised by using narrower horizontal margins. On desktop, the width of the article text is not too wide, to allow for comfortable reading.

## Code formatting

I used [Prettier](https://prettier.io/) to format my JavaScript, CSS and HTML code consistently. I included a `.prettierrc` file in the root folder, and set the app up without semicolons at the end of JavaScript statements, in line with the documentation on the [Next.js](https://nextjs.org/) website.

## Accessibility notes

### Semantic HTML elements

I used these semantic elements in the article view:

```html
<header>
<nav>
<article>
<section>
```

### Login form

For the [login form](http://localhost:3000/login), I used `id`, `name` and `for` attributes (`htmlFor` in React) to tie labels and input boxes together.

### Accessibility improvements

Running a Lighthouse test on [this page on the hbl.fi site](https://www.hbl.fi/artikel/sista-debatten-trump-biden-kan-avgora-valet-vagmastarstaterna-har-overraskat-forr/) flagged up some accessibility issues.

### Issue 1: "Heading elements are not in a sequentially-descending order"

Problem:

Here is a subheading from that page:

```html
<strong class="subheadline1">Ingen garanti</strong>
```

Solution:

```html
<h2 class="subheadline1">Ingen garanti</h2>
```

### Issue 2: "Image elements do not have [alt] attributes"

Problem:

```html
<div class="ksf-article-images">
  <!-- ... image and caption in separate divs, caption in a <p> tag, and missing alt attribute ... -->
</div>
```

Solution:

```html
<figure>
  <img src="..." alt="Belmont University ..." />
  <figcaption>Belmont University ...</figcaption>
</figure>
```

This follows advice from [The Figure with Optional Caption element - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

## Authentication notes

Authentication information is stored in cookies. I couldn't use `localStorage` in the browser because `getServerSideProps` works on the server and doesn't have access to the browser's `localStorage`.

I used `axios` to make API requests. I read that it does a good job of standardising API requests from the server and the client.

## What next?

Here are the things I would add next to this app, if I were getting it ready for production:
- Search engine optimisation (SEO)
- Friendlier URLs for the article pages
- Testing with [Cypress](https://www.cypress.io/)
- Refactoring React components into smaller components, to make the code more readable
- Customising Tailwind with brand colours and so on
- Error handling. I have a little of this, but not much.
