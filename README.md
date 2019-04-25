# Lovelace PostNL
Home Assistant Lovelace card for PostNL.

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
    packages: sensor.postnl_packages
    letters: sensor.postnl_letters
 ```

## Inspired by
* [simple-thermostat](https://github.com/nervetattoo/simple-thermostat)

## Contributors
* [Peter Nijssen](https://github.com/peternijssen)
