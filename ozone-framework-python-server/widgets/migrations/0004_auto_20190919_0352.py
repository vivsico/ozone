# Generated by Django 2.2.1 on 2019-09-19 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('widgets', '0003_auto_20190827_1343'),
    ]

    operations = [
        migrations.AddField(
            model_name='widgetdefinition',
            name='types',
            field=models.ManyToManyField(related_name='widgets', through='widgets.WidgetDefinitionWidgetTypes', to='widgets.WidgetType'),
        ),
        migrations.AlterField(
            model_name='widgetdefinition',
            name='universal_name',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
