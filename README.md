# Lovelace PostNL
Home Assistant Lovelace card for PostNL.

![Example](https://community-home-assistant-assets.s3.dualstack.us-west-2.amazonaws.com/original/3X/5/2/527bc612e6eb092f1d4887e9d6272c7b4278ec65.png)

## Warning!
This card is not compatible with the current Home Assistant component. Please read this topic:
https://community.home-assistant.io/t/lovelace-postnl/112433

## Installation

Configure Lovelace to load the card:
```
resources:
  - url: /local/postnl-card.js
    type: module
 ```

Example usage:
```
cards:
  - type: "custom:postnl-card"
    delivery: sensor.postnl_delivery
    distribution: sensor.postnl_distribution
    letters: sensor.postnl_letters
    hide:
      delivered: false
 ```

## Available configuration options
- `delivery` _string_: The delivery sensor. Don't add this if you are not interested in package deliveries
- `distribution` _string_: The distribution sensor.  Don't add this if you are not interested in package distribution
- `letters` _string_: The letters sensor.  Don't add this if you are not interested in letters
- `name` _string_: Override the card name. By default shows "PostNL"
- `icon` _string_: Icon next to the card name. By default shows "mdi:mailbox"
- `hide` _object_: Control specifically information fields to show.
  - `delivered`: _bool_ (Default to `false`) Controls if you want to show packages that are delivered already

## Inspired by
* [simple-thermostat](https://github.com/nervetattoo/simple-thermostat)

## Contributors
* [Peter Nijssen](https://github.com/peternijssen)
