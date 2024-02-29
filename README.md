# SEO Meta Fields app for Enonic XP

This Enonic XP application adds a multitude of helpful meta fields for your [Enonic XP](https://github.com/enonic/xp) site. Like [Open Graph](http://ogp.me/) meta fields, [Twitter Cards](https://dev.twitter.com/cards/overview) meta fields, [Google Search Console](https://www.google.com/webmasters/tools) meta tag, and more! It also let's you better customize your site's and contents' title tag and meta description information. By applying mixin-fields to each content you can easily fine tune your sites' SEO and social sharing!

This app will add the following functionality to your site:

1. SEO friendly titles
2. SEO meta description
3. Social media sharing image (custom per content)
4. Open Graph meta data
5. Twitter Cards meta data
6. Google Search Console meta tag
7. Canonical meta tag
8. Robots.txt exclude setting
9. Widget for Content Studio that displays all the SEO data!
10. Configure the app through config-files on the server.

## Installation

Go into the Enonic XP Application admin tool and install the app from the [Enonic Market](https://market.enonic.com/).

The **SEO Meta Fields** app will then be available to add to your websites through the Content Studio admin tool in Enonic XP. Edit your site content to add this app. Remember to save (after you've configured the app).

## How to use this app

There are multiple ways to configure this application:
1. Per content [Content configuration](content-configuration)
2. Per site [Site configuration](site-configuration)
3. Across server [Application configuration](application-configuration)

There are two ways of using this application on a site:

1. [Adding meta tags to pages](adding-meta-tags-to-pages)
2. [Headless integration](headless-integration)

### Adding meta tags to pages

If you are doing normal Enonic XP page rendering then the metafields response processor will inject meta tags into the html page.

> **_NOTE:_** You do not need to change anything in your code for this app to work. It will add meta description, Twitter Cards, and Open Graph meta fields even if you already added this in your code, so please remove those fields first! The logic behind adding a SEO friendly title is smarter and it will never insert duplicate `<title>` tags.

### Headless integration

If you are doing external rendering, for example via Next.XP, you need to install a recent version (7.0.3) of App Guillotine, and add it to your site.

Then you can fetch the metadata you need from Enonic XP using GraphQL.

Use the `Query playground` in Content Studio to study the Guillotine Schema. You can find a field named `metaFields` on the `Content` object type.

You may also study how we did it in our own [site-enonic-next](https://github.com/enonic/site-enonic-next).

## Content configuration

After adding this app to a site you should see a new `SEO`-section on all of your contents. The fields in this section can be used to set a custom title, description and/or image on each content, used only for SEO purposes. Click the "+ SEO" (or anywhere on the box) to add the SEO fields to any content when editing it. With the fields added you can tailor your SEO as needed.

## Site configuration

This app introduces a number of site configurations, which are used across the entire site.

1. General settings
2. Fallback
3. Title config
4. Verification
5. Twitter Cards
6. Open Graph
7. JSON paths

> **_NOTE:_** You can also set defaults across the entire server using an [application config](application-configuration) file.

### General settings

**Hide site from search engines?**
We also introduce a setting for hiding the entire site from search engine robots. This might be handy when wanting to have a live beta site but not letting search engine index it. It's up to the search engines to respect this setting, and this setting does not hide the pages from outside visitors as links to them and direct URL's will still work.

#### Base URL

When using normal Enonic XP page rendering this will override the vhost domain when generating urls for html meta tags canonical and og:url.

When fetching metadata using using Guillotine the metaFields.canonical and metaFields.url fields will be site relative urls, unless baseUrl is set (in which case baseUrl is used as a prefix and the urls become absolute).

### Fallback settings

This app tries to figure out which data to use for all the meta fields based on the current content. On some pages, there might not be any custom data set. That's what these settings are for: default fallbacks. Here is where you add a default image to fallback on for Open Graph and Twitter Cards. If you don't set one here, it will try to use the image set or found on the site content.

### Title config

With the title configuration you can control how we create the titles for you. If you already have a `<title>` tag in your source html, we will overwrite it and use it's location in the source code. If you do not have this tag already, we will append it at the end of the `<head>`-tag.

The settings here let you control if you want to add the site's name at the end of all pages' titles. You can activate this on all pages, but also control to not do this on the front page. There's also an option for controlling what separator sign to use between page name and site name (defaults to the dash character).

Note: Meta fields for Open Graph and Twitter Cards does not use these settings, it never adds site name to it's title meta field as it is redundant data.

### Verification

**Google Search Console (site verification code)**
Add meta tag for Google Search Console (formerly known as Google Webmaster Tools). Just fill in your ID here to generate the proper tag on all pages. Consult your Google Search Console login for finding this ID.

### Twitter Cards

For Twitter Cards to work we need a Twitter username (starting with `@`). When that is in place we can generate meta data for improved Twitter sharing called "Twitter Cards". By omitting the username no such meta data will be generated.

### Open Graph

**Remove the openGraph Url tag?**
Checking this will stop the app from generating the open graph url tag

**Remove the openGraph image tag?**
Checking this will stop the app from generating the open graph image tag

### JSON paths

When figuring out what data to put in your meta fields, this app analyzes the current content you're viewing. It will fetch a pre-defined set of fields in a pre-defined order (more on that later in the [waterfall logic](waterfall-logic-for-meta-fields) section). You might however have fields with different names, or want to add more fields, or control in which order the data is evaluated. Then these settings are for you.

Add field names, like `field1`, `field2`, `long-fieldname3`. It will handle dashes and other special characters in your field names. These custom fields will be checked before any other fields. If you add more than one field here, the first match wins. So if we find data in `field2` we won't look in `long-fieldname3`.

We only evaluate for matches in the JSON `data`-node for each content. So if you fill in `myField`, we'll look for `data.myField` in the content JSON (refer to Enonic XP's documentation on `getContent()` function).

### Application configuration

You can put a file on the server to configure `defaults` for all sites using the app across the server.

> **_NOTE:_** All settings can be overriden per site using site configuration.

Locate your `$XP_HOME/config/` folder and create a file called `com.enonic.app.metafields.cfg` and fill it with data like this, changing variables as needed (remove or comment out the ones you don't need):

```
# Configuration file for SEO Metafields app.
canonical = true|false
siteVerification = "xxx"
blockRobots = true|false
# This one is specific for the configuration file, use it when editing the app config in Content Studio to overwrite any configuration from this file.
# disableAppConfig = true|false
titleSeparator = "<3"
titleBehaviour = true|false
titleFrontpageBehaviour = true|false
twitterUsername = "@companyTwitter"
removeTwitterImage = true|false
removeOpenGraphUrl = true|false
removeOpenGraphImage = true|false
# seoImage = "[AnyImageContentID]"
seoImageIsPrescaled = true|false
seoTitle = "Fallback title"
seoDescription = "Fallback description"
pathsImages = "media.mediaImage.imgSrc, mediaImage"
pathsTitles = "data.customTitle, someField"
pathsDescriptions = "data.description, data.preface"
```

You can find this example file in the root directory of this repo.

## Waterfall logic for meta fields

We will always add the meta fields for title and description, and most of the meta fields for Open Graph. However, if we cannot find any image to use, we won't add the meta fields for Open Graph image or Twitter Cards image.

It's important to understand the waterfall logic we use when evaluating which data to use for our meta fields (with the first match overwriting all the following ones):

### For titles

1. Current content's `SEO` mixin's `title` field.
2. The site config's custom JSON paths, if any (in the order defined).
3. The app config's custom JSON paths, if any (in the order defined).
4. The content's `displayName` field (all content has this field).

For titles there is no way it can be empty, at least the last fallback will always have a value.

### For descriptions

1. Current content's `SEO` mixin's `description` field.
2. The site config's custom JSON paths, if any (in the order defined).
3. The app config's custom JSON paths, if any (in the order defined).
4. See if the site itself has the `SEO` field `description` filled out.
5. As a last resort, we default to the site's `description` field (default Enonic XP data).
6. An empty description is created.

### For images

1. Current content's `SEO` mixin's `image` field.
2. First outboundDependency of type media:image on the content.
3. The site config's custom JSON paths, if any (in the order defined).
4. The app config's custom JSON paths, if any (in the order defined).
5. Site content's `SEO` mixin's `image` field.
6. First outboundDependency of type media:image on the site.
7. If nothing is found the meta fields for the image are not created.

## Upgrade notes

### 1.x.x to 2.0.0

#### Metafields service replaced by Guillotine Extension

In version 2.0.0 the metafields service has been removed in favour of a Guillotine Extension.

If you are using the metafields response processor, this doesn't affect you.

If however you are doing external rendering, see [Headless integration](headless-integration).

#### SiteConfig

The site config has been cleaned up a bit.

Some settings have been removed, some have been added, and the order has also been changed.

##### Base URL

A `Base URL` textline has been <span style="color:green">added</span>. See [Base URL](base-url)

##### Headless

The `Headless mode` checkbox has been <span style="color:red">removed</span>.

If you are doing normal Enonic XP page rendering and applyFilters is true (the default) in the page response, then the metafields response processor will run.

If applyFilters is false, or you are doing external rendering, for example via Next.XP, the response processor is not called, and you will have to apply metafields on your own.

In order to apply your own metafields, you can use the new Metafields Guillotine Extension, to get all the metadata you need.

##### Canonical

The `Use canonical meta?` checkbox has been <span style="color:red">removed</span>.

Canonical now follows the standard and will only be added if a canonical content has been configured for a specific content.

In addition canonical is automatically added for `variants`.

##### Application config

The `Don't overwrite values from app.config` checkbox has been <span style="color:red">removed</span>.

The old logic was confusing now a configuration property gets it's value like this:

```
const value = siteConfig[name] || app.config[name] || 'hardcoded default'
```
##### Frontpage image fallback

The `Frontpage image fallback` image selector and the accompanying `Serve the frontpage image as is. No system scaling` checkbox has been <span style="color:red">removed</span>.

It will automatically use the image set or found on the site content instead. See waterfall logic for [images](#for-images).

##### Title fallback

The `Title fallback` textline has been <span style="color:red">removed</span>.

The `Title fallback` actually never made any sence, since all content has to have a display name. See waterfall logic for [titles](for-titles)

##### Description fallback

The `Description fallback` textarea has been <span style="color:red">removed</span>.

It will automatically use the description set or found on the site content instead. See waterfall logic for [descriptions](for-descriptions).

##### JSON paths

The maximum occurrences has been <span style="color:green">increased</span> from 1 to 0 (meaning infinite) for the `Images`, `Titles` and `Descriptions` textlines. The old comma-separated syntax is still supported, but it looks way nicer to have a separate entry per item.

## Changelog

See releases on the [Market page](https://market.enonic.com/vendors/enonic/com.enonic.app.metafields)
