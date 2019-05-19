# GDPR
GDPR, DSGVO Opt-In and Opt-Out

## Fields
|Attribute|Type|Description|
|---|---|---|
|data-PPName|String|To distinguish the plugins and display the plugin name to the user|
|data-PPSrc|Source|Source of the plugin to be loaded|
|data-PPInfo|Url|Href to other source (internal or external)|
|data-PPAllowed|Boolean|\[optional] Force loading before accepting (No Opt-In needed)|


## Usage
```
<link defer rel="stylesheet" href="policy.css"></link>
<script defer type="text/javascript" src="PrivacyPolicy.js"></script>
```


## Example

#### Implementing
Include the data tags
  
```
<script onload='loadGMaps()' data-PPName='Google Maps' data-PPSrc='https://maps.googleapis.com/maps/api/js?sensor=false' data-PPInfo='https://policies.google.com/privacy' type="text/javascript"></script>
```
  
#### Placeholder
If you have many pages with different plugins active don't forget to include a placeholder for every plugin!
Otherwise, the user will receive the popup every time when a new plugin is detected.

```
<span
  data-PPName='Google Maps'
  data-PPSrc='https://maps.googleapis.com/maps/api/js?sensor=false'
  data-PPInfo='/privacy_policy#GoogleMaps'>
</span>
```


## Demo
You can see the final product here: https://marcelkempf.github.io/GDPR/index.html
