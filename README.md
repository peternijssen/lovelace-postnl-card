# Lovelace PostNL

[![](https://img.shields.io/github/release/peternijssen/lovelace-postnl-card.svg?style=flat-square)](https://github.com/peternijssen/lovelace-postnl-card/releases/latest)
[![](https://img.shields.io/travis/peternijssen/lovelace-postnl-card.svg?style=flat-square)](https://travis-ci.org/peternijssen/lovelace-postnl-card)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Home Assistant Lovelace card for PostNL.

**WARNING: This card is not compatible with the current Home Assistant component. Please read this topic:
https://community.home-assistant.io/t/lovelace-postnl/112433**

![Example](https://community-home-assistant-assets.s3.dualstack.us-west-2.amazonaws.com/original/3X/5/2/527bc612e6eb092f1d4887e9d6272c7b4278ec65.png)

## Features
* Display of letters
* Carousel of images of letters
* List of packages enroute to you
* List of packages submitted by you
* Contains direct links to the web interface of PostNL

## Installation

1. Download the `lovelace-postnl.js` from the [latest release](https://github.com/peternijssen/lovelace-postnl/releases/latest) and store it in your `configuration/www` folder.
2. Configure Lovelace to load the card:

```
resources:
  - url: /local/postnl-card.js
    type: module
 ```

### Installation and tracking with `HACS` _(Recommended)_
1. Make sure you've the [HACS](https://custom-components.github.io/hacs/) component installed and working
2. Search for the PostNL card in the store
3. Configure Lovelace to load the card:

```yaml
resources:
  - url: /community_plugin/lovelace-postnl-card/postnl-card.js
    type: module
```

### Installation and tracking with `custom updater` _(Deprecated)_

1. Make sure you've the [custom_updater](https://github.com/custom-components/custom_updater) component installed and working.
2. Add a new reference under `card_urls` in your `custom_updater` configuration in `configuration.yaml`.

  ```yaml
  custom_updater:
    card_urls:
      - https://raw.githubusercontent.com/peternijssen/lovelace-postnl/master/tracker.json
  ```
3. Configure Lovelace to load the card:

```yaml
resources:
  - url: /customcards/postnl-card.js
    type: module
```

4. Run the service `custom_updater.check_all` or click the "CHECK" button if you use the tracker-card.
5. Refresh the website.

## Example usage
```
cards:
  - type: "custom:postnl-card"
    delivery: sensor.postnl_delivery
    distribution: sensor.postnl_distribution
    letters: sensor.postnl_letters
    hide:
      delivered: false
      first_letter: false
      header: false
    date_format: "DD MMM YYYY"
    time_format: "HH:mm"
    past_days: 1
 ```

## Available configuration options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| delivery | string | - | v0.8 | The delivery sensor. Don't add this if you are not interested in package deliveries |
| distribution | string | - | v0.8 | The distribution sensor.  Don't add this if you are not interested in package distribution |
| letters | string | - | v0.8 | The letters sensor.  Don't add this if you are not interested in letters |
| name | string | PostNL | v0.8 | Override the card name |
| icon | string | mdi:mailbox | v0.8 | Icon next to the card name |
| hide | object | object | v0.8 | Control specifically information fields to show. |
| date_format | string | DD MMM YYYY | v0.9 | Overrides the default date [format](https://momentjs.com/docs/#/displaying/format/). |
| time_format | string | HH:mm | v0.9 | Overrides the default time [format](https://momentjs.com/docs/#/displaying/format/). | 
| past_days |integer | 1 | v0.9 | Defines how many days you want to see from the past. |


## Hide object
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| delivered | bool | false | v0.8 |  Controls if you want to show packages that are delivered already |
| first_letter | bool | false | v0.8 |  Controls if  you want to show the image of the very first letter |
| header | bool | false | v0.9 |  Controls if it displays the top most header |


## Inspired by
* [simple-thermostat](https://github.com/nervetattoo/simple-thermostat)
* [mini-media-player](https://github.com/kalkih/mini-media-player)
* [swiper-card](https://github.com/bramkragten/custom-ui)

## Contributors
* [Peter Nijssen](https://github.com/peternijssen)
* [Rob van Uden](https://github.com/robvanuden)
