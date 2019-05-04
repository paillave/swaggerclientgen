{% set dicoType={"integer":"number"} %}
{% macro isOptional(propertyName, entityDefinition) %}
{% if not entityDefinition.required or not entityDefinition.required.includes(propertyName) %}?{% endif %}
{% endmacro %}
{% macro fieldType(propertyDefinition) %}
{% if propertyDefinition["$ref"] %}
I{{propertyDefinition["$ref"]|replace("#/definitions/", "")}}{% elif propertyDefinition.type=="array" %}
[{{fieldType(propertyDefinition.items)}}]{% else %}
{{dicoType[propertyDefinition.type]|default(propertyDefinition.type)}}{% endif %}
{% endmacro %}
{% macro field(propertyName, propertyDefinition, entityDefinition) %}
{{propertyName}}{{isOptional(propertyName, entityDefinition)}}: {{fieldType(propertyDefinition)}};
{% endmacro %}
{% for entityName, entityDefinition in definitions %}
export interface I{{entityName}} {
{% for propertyName, propertyDefinition in entityDefinition.properties %}
    {{field(propertyName, propertyDefinition, entityDefinition)}}{% endfor %}
}
{% endfor %}