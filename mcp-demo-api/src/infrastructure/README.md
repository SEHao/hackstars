# Infrastructure Module
Onze applicaties hebben regelmatig integraties met andere applicaties en systemen. In dit document staat beschreven hoe wij als team ROTS deze integraties op een standaard manier neerzetten en hoe je die op de beste manier kan implementeren. 

Het doel is om al onze systemen “loosely coupled” te maken (dat wil zeggen: als er een systeem vervangen of veranderd wordt dat we die change gemakkelijk kunnen doorvoeren in onze codebase).

Als voorbeeld hebben we hier de implementatie van de HttpCat koppeling in mcp-demo-api. In deze koppeling worden kattenplaatjes opgehaald opgehaald uit HttpCat om aan de gebruiker te tonen.

## Infrastructure 
Alle communicatie met het externe endpoint of systeem (of dat nou een API endpoint is of iets anders), gebeurt in een module in de infrastructure laag van ons systeem. Deze module is de enige plek in onze codebase waar we een directe koppeling met het externe systeem hebben (in dit geval de API endpoint). Je zult dus zien dat de “HttpCat” naam alleen in de Infrastructure module te vinden is, en nergens anders.

In de HttpCat module in de infrastructure laag, zitten 2 services:

1 service die direct de API endpoint aanroept, eventueel HTTP errors afhandelt, en de response returned.

1 “Facade” service. Dit is als het ware de “interface” richting ons eigen systeem. Dit is de service die dus ook op andere plekken in ons Domain wordt aangeroepen. 

In deze service vind ook de Mapping plaats van de HttpCat DTO naar het object wat we zelf gebruiken in ons domain: onze BO. (Hier wordt dus bijv. de HttpCatDto naar de CatBo gemapped: merk op dat er dus geen HttpCat meer in de naamgeving zit, maar alleen Cat). Deze mapper wordt geinjecteerd vanuit de Domain laag! (Zie "Domain")

### Dynamic Module
De HttpCat module in de infrastructure laag is een DynamicModule van NestJS (Dynamic modules | NestJS - A progressive Node.js framework)[https://docs.nestjs.com/fundamentals/dynamic-modules]. Dit betekent dat de module at runtime aangemaakt wordt obv van configuratie die je zelf meestuurt. Deze techniek wordt hier gebruikt om vanuit de Domain een custom Mapper te injecteren die in de Facade service gebruikt wordt. Zo kunnen we gemakkelijk de infra module omwisselen of aanpassen, zonder veel impact op ons eigen domein. 

## Domain
In de Domain laag is het de bedoeling dat we alleen data gebruiken die voor ons domein relevant is. Dat betekent dat we hier dus niet direct gebruik maken van de DTOs van het externe systeem. In plaats daarvan bevat de domain laag een mapper die de DTO naar een BO mapped. In ons domein kennen we dus alleen een BO. Alles wat te maken heeft met het externe systeem te maken heeft staat in de Infra module.

Let op: de mapper staat op code niveau in de Domain laag, maar wordt in de Infra module geinjecteerd. Op deze manier kan je vanuit het Domain zelf kiezen hoe je de data uit het externe systeem gebruikt, en wordt de Infra module generiek inzetbaar.

In het HttpCat voorbeeld betekent dit dat er in de Domain laag van mcp-demo-api een mapper is die een HttpCatDto naar een CatBo mapped. In de Domain laag kennen we dus alleen CatBos en geen HttpCatDtos. (Alle naamgeving moet dus ook niet gebaseerd zijn op HttpCat, tenzij je in de infra module zit).

In de Domain laag wordt ook de Facade service aangeroepen uit de Infra module & de mapper wordt vanuit de Domain in de Infra module geinjecteerd. 

## Resource
De Resource laag wordt net als normaal geimplementeerd. Deze haalt data op uit de Domain laag & kent alleen de BOs uit ons domein zelf. In het HttpCat voorbeeld, betekent dit dat er een cat-resource.module is, die zijn data (CatBos) uit de Domain laag haalt.

## Hoe ga ik te werk?
Wanneer je een extern systeem of API gaat implementeren, zijn er een aantal dingen om in gedachte te houden:

Stem voordat je begint met programmeren een contract af. Daarna ga je vanaf dit contract verder bouwen. Je kan niet altijd bouwen op het externe systeem tijdens development. Misschien is het systeem nog niet af, misschien verandert het, of misschien gaat het systeem vaak offline.

Op basis van het contract implementeer je eerst je Wiremock endpoints. Wiremock is een krachtige tool, waarmee je veel functionaliteit van externe APIs kan wegmocken. Als je dit zorgvuldig doet, kun je je eigen werk succesvol afronden zonder afhankelijk te zijn van andere systemen / teams. 

Als je ook een koppeling naar de frontend maakt, zorg er dan ook voor dat je daar ook een contract afspreekt. Dan kan de frontend ook een wiremock endpoint opzetten, en kunnen de frontend & backend developers onafhankelijk van elkaar werken.

De benaming van je functies en variabelen kan een teken zijn of je op de goede weg bent. Als je bijv. in de Resource of Domain laag ziet dat je een variabele hebt vernoemd naar het externe systeem (je hebt bijv. een httpCatUrl of httpCatType oid in je domain of resource staan), dan worden je modules “tightly coupled”, en dat is wat we juist proberen te voorkomen.