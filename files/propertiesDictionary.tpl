{% set dicoType={"integer":"number"} %}
{% macro entity(entityName, entityDefinition) %}
{% if not entityName.startsWith("ModelWithReferences[") %}
{{interface(entityName, entityDefinition)}}
{% endif %}
{% endmacro %}
{% macro interface(entityName, entityDefinition) %}
    {{entityName}}: {
{% for propertyName, propertyDefinition in entityDefinition.properties %}
        {{propertyName}}: "{{propertyName}}",
{% endfor %}
    },
{% endmacro %}
export default {
{% for entityName, entityDefinition in definitions %}
{{entity(entityName, entityDefinition)}}
{% endfor %}
};