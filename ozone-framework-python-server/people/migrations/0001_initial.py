# Generated by Django 2.2.1 on 2019-08-15 21:29

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('widgets', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('version', models.BigIntegerField(default=1)),
                ('enabled', models.BooleanField(default=True)),
                ('user_real_name', models.CharField(max_length=200)),
                ('username', models.CharField(max_length=200, unique=True)),
                ('last_login', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('email_show', models.BooleanField(default=True)),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('prev_login', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('last_notification', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('requires_sync', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'person',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonRole',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('person_authorities_id', models.BigIntegerField(blank=True, null=True)),
                ('role_id', models.BigIntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'person_role',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonWidgetDefinition',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('version', models.BigIntegerField()),
                ('visible', models.BooleanField()),
                ('pwd_position', models.IntegerField()),
                ('group_widget', models.BooleanField(blank=True, null=True)),
                ('favorite', models.BooleanField(blank=True, null=True)),
                ('display_name', models.CharField(blank=True, max_length=256, null=True)),
                ('disabled', models.BooleanField(blank=True, null=True)),
                ('user_widget', models.BooleanField(blank=True, null=True)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('widget_definition', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='widgets.WidgetDefinition')),
            ],
            options={
                'db_table': 'person_widget_definition',
                'managed': True,
                'unique_together': {('person', 'widget_definition')},
            },
        ),
    ]
