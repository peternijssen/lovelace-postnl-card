# Lovelace PostNL
Unofficial Home Assistant Lovelace card for PostNL.

The card is not compatible with the current implementation. It requires a custom component for now, which will be shared as soon as 0.92 of HA is released.

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
